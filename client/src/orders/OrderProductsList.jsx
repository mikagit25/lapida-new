import React from 'react';
import OrderProductCard from './OrderProductCard';

export default function OrderProductsList({ items }) {
  if (!Array.isArray(items) || items.length === 0) return <div className="text-gray-400">Нет товаров</div>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
      {items.map(item => (
        <OrderProductCard key={item._id} product={item.productId} item={item} />
      ))}
    </div>
  );
}
