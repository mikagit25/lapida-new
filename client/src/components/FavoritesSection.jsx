import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

// Раздел избранного для личного кабинета
const FavoritesSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const favIds = JSON.parse(localStorage.getItem('favoriteProducts') || '[]');
    if (!favIds.length) {
      setProducts([]);
      setLoading(false);
      return;
    }
    // Получаем товары по id (можно оптимизировать через API, если есть)
    fetch(`/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products.filter(p => favIds.includes(p._id)));
        } else {
          setProducts([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Загрузка избранного...</div>;
  if (!products.length) return <div>Нет товаров в избранном.</div>;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Избранные товары</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {products.map(p => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesSection;
