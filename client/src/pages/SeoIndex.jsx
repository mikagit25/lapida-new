import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// SEO-страница для поисковых ботов и ускорения индексации

const SeoIndex = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Получаем компании и товары с API (только id/slug и название)
    fetch('/api/companies?fields=customSlug,name')
      .then(res => res.json())
      .then(data => setCompanies(data?.companies || []));
    fetch('/api/products?fields=slug,name')
      .then(res => res.json())
      .then(data => setProducts(data?.products || []));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">{t('seo_index_title')}</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t('seo_index_sections')}</h2>
        <ul className="list-disc pl-6">
          <li><Link to="/">{t('seo_index_main')}</Link></li>
          <li><Link to="/companies">{t('seo_index_companies')}</Link></li>
          <li><Link to="/products">{t('seo_index_products')}</Link></li>
          <li><Link to="/memorials">{t('seo_index_memorials')}</Link></li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t('seo_index_companies')}</h2>
        <ul className="list-disc pl-6">
          {companies.map(c => (
            <li key={c.customSlug}><Link to={`/company/${c.customSlug}`}>{c.name} ({c.customSlug})</Link></li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t('seo_index_products')}</h2>
        <ul className="list-disc pl-6">
          {products.map(p => (
            <li key={p.slug}><Link to={`/products/${p.slug}`}>{p.name} ({p.slug})</Link></li>
          ))}
        </ul>
      </section>
      <div className="text-gray-400 text-xs mt-8">{t('seo_index_note')}</div>
    </div>
  );
};

export default SeoIndex;
