import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

// Раздел просмотренных товаров для личного кабинета
const ViewedSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const viewedIds = JSON.parse(localStorage.getItem('viewedProducts') || '[]');
    if (!viewedIds.length) {
      setProducts([]);
      setLoading(false);
      return;
    }
    // Получаем товары по id (можно оптимизировать через API, если есть)
    fetch(`/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products.filter(p => viewedIds.includes(p._id)));
        } else {
          setProducts([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка просмотренных товаров...</div>;
  if (!products.length) return <div>Нет просмотренных товаров.</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Просмотренные товары</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default ViewedSection;
