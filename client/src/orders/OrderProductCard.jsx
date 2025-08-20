import React from 'react';

export default function OrderProductCard({ product, item }) {
  if (!product) return null;
  return (
    <div className="flex items-center border rounded p-2 bg-gray-50">
      {product.images?.[0] && (
        <a href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer">
          <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded mr-2 border" />
        </a>
      )}
      <div>
        <a href={`/product/${product.slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-700 hover:underline">{product.name || item.name}</a>
        <div className="text-sm text-gray-600">{item.quantity} шт × {item.price}₽</div>
      </div>
    </div>
  );
}
