import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <Link to={`/products/${product.slug}`} className="block mb-2">
        {product.images && product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded" />
        ) : (
          <div className="w-full h-40 bg-gray-200 flex items-center justify-center rounded text-gray-500">Нет фото</div>
        )}
      </Link>
      <div className="mb-2 font-bold text-lg">{product.name}</div>
      <div className="text-gray-700 mb-2">{product.category}</div>
      <div className="text-blue-700 font-semibold mb-2">{product.price} ₽</div>
      <Link to={`/products/${product.slug}`} className="mt-auto bg-blue-600 text-white px-3 py-1 rounded text-center">Подробнее</Link>
    </div>
  );
}
