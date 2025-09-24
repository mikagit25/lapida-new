import React from 'react';

const OrganizationProducts = ({ products }) => {
  if (!products || products.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((p, i) => (
        <li key={i} className="border rounded p-3 bg-gray-50 flex gap-3">
          {p.image && <img src={p.image} alt="Товар" className="w-20 h-20 object-cover rounded" />}
          <div>
            <div className="font-semibold">{p.name}</div>
            <div className="text-gray-600 text-sm mb-1">{p.description}</div>
            {p.price && <div className="text-blue-700 font-bold">Цена: {p.price} ₽</div>}
            <div className={p.available ? 'text-green-600' : 'text-red-600'}>{p.available ? 'В наличии' : 'Нет в наличии'}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrganizationProducts;
