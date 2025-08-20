import React from 'react';
import AddToCartButton from './AddToCartButton';
import ProductCard from './ProductCard';

export default function ProductList({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return <div className="text-gray-500 py-4">Нет товаров или услуг</div>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product._id || product.id} className="flex flex-col gap-2">
          <ProductCard
            product={product}
            onEdit={onEdit ? () => onEdit(product) : undefined}
            onDelete={onDelete ? () => onDelete(product) : undefined}
          />
          <AddToCartButton product={product} />
        </div>
      ))}
    </div>
  );
}
