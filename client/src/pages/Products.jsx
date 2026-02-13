import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

export default function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('new');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [companySlug, setCompanySlug] = useState('');
  const [companyId, setCompanyId] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ search, category, sort });
      if (companyId) params.append('companyId', companyId);
      const res = await apiFetch(`${API_BASE_URL}/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Ошибка загрузки каталога:', err);
      setError('Ошибка загрузки каталога');
    }
    setLoading(false);
  }, [category, companyId, search, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Получить companyId по slug, если указан
  useEffect(() => {
    if (!companySlug) return;
    apiFetch(`${API_BASE_URL}/companies/by-slug/${companySlug}`)
      .then(res => res.json())
      .then(data => {
        if (data.company && data.company._id) setCompanyId(data.company._id);
        else setCompanyId('');
      })
      .catch(() => setCompanyId(''));
  }, [companySlug]);

  // Категории для фильтра
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h1 className="text-3xl font-bold mb-6">{t('products_title')}</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder={t('search_by_name_or_desc')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />
          <input
            type="text"
            placeholder={t('company_short_slug')}
            value={companySlug}
            onChange={e => setCompanySlug(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />
          <select value={category} onChange={e => setCategory(e.target.value)} className="border px-3 py-2 rounded">
            <option value="">{t('all_categories')}</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} className="border px-3 py-2 rounded">
            <option value="new">{t('sort_newest')}</option>
            <option value="price-asc">{t('sort_price_asc')}</option>
            <option value="price-desc">{t('sort_price_desc')}</option>
          </select>
        </div>
        {loading ? (
          <div>{t('loading')}</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : products.length === 0 ? (
          <div>{t('no_products_found')}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
