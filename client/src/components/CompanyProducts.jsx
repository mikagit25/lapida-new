import React from 'react';
export default function CompanyProducts({ products }) {
  if (!products || products.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-xl mb-2">Товары / услуги</h2>
      <div className="grid grid-cols-2 gap-4">
        {products.map(product => (
          <div key={product._id} className="border rounded p-4">
            <div className="font-bold mb-2">{product.name}</div>
            <div className="text-gray-600 mb-2">{product.description}</div>
            {product.images && product.images[0] && (
              <img src={product.images[0]} alt={product.name} className="w-full h-32 object-cover rounded mb-2" />
            )}
            <div className="text-blue-600 font-semibold">{product.price} ₽</div>
          </div>
        ))}
      </div>
    </div>
  );
}
