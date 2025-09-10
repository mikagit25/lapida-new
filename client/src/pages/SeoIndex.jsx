import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// SEO-страница для поисковых ботов и ускорения индексации
const SeoIndex = () => {
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
      <h1 className="text-2xl font-bold mb-6">SEO-индекс сайта Lapida</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Основные разделы</h2>
        <ul className="list-disc pl-6">
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/companies">Компании</Link></li>
          <li><Link to="/products">Товары</Link></li>
          <li><Link to="/memorials">Мемориалы</Link></li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Компании</h2>
        <ul className="list-disc pl-6">
          {companies.map(c => (
            <li key={c.customSlug}><Link to={`/company/${c.customSlug}`}>{c.name} ({c.customSlug})</Link></li>
          ))}
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Товары</h2>
        <ul className="list-disc pl-6">
          {products.map(p => (
            <li key={p.slug}><Link to={`/products/${p.slug}`}>{p.name} ({p.slug})</Link></li>
          ))}
        </ul>
      </section>
      <div className="text-gray-400 text-xs mt-8">Страница обновляется автоматически при изменении компаний и товаров.</div>
    </div>
  );
};

export default SeoIndex;
