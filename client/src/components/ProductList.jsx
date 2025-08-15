import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return <div className="text-gray-500 py-4">Нет товаров или услуг</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((prod, idx) => (
        <div key={prod._id || idx} className="relative">
          <ProductCard product={prod} />
          <div className="absolute top-2 right-2 flex gap-2">
            {onEdit && <button className="bg-yellow-500 text-white px-3 py-1 rounded" onClick={() => onEdit(prod)}>Редактировать</button>}
            {onDelete && <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => onDelete(prod)}>Удалить</button>}
          </div>
        </div>
      ))}
    </div>
  );
}
