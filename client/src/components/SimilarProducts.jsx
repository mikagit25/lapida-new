import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

const SimilarProducts = ({ product }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!product || !product.category) return;
    setLoading(true);
    setError('');
    apiFetch(`${API_BASE_URL}/products?category=${encodeURIComponent(product.category)}`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          // Исключаем текущий товар и ограничиваем до 6
          setSimilar(data.products.filter(p => p._id !== product._id).slice(0, 6));
        } else {
          setSimilar([]);
        }
      })
      .catch(() => setError('Ошибка загрузки аналогичных товаров'))
      .finally(() => setLoading(false));
  }, [product]);

  if (!product || !product.category) return null;
  if (loading) return <div className="mt-8">Загрузка аналогичных товаров...</div>;
  if (error) return <div className="mt-8 text-red-600">{error}</div>;
  if (!similar.length) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">Похожие товары</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {similar.map(p => (
          <Link key={p._id} to={`/products/${p.slug}`} className="block bg-white rounded shadow p-4 hover:shadow-lg transition">
            <div className="mb-2 flex justify-center">
              <img src={p.images && p.images[0] ? p.images[0] : '/no-image.png'} alt={p.name} className="w-32 h-32 object-cover rounded" />
            </div>
            <div className="font-bold mb-1">{p.name}</div>
            <div className="text-gray-700 mb-1">{p.price}₽</div>
            <div className="text-xs text-gray-500">{p.category}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
