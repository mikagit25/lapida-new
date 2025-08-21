import React, { useState } from 'react';
import ProductList from './ProductList';

function CompanyProductsProfileBlock({ products }) {
  const [showAll, setShowAll] = useState(false);
  if (!products || products.length === 0) return null;
  const maxRows = 2;
  const itemsPerRow = 4;
  const maxVisible = maxRows * itemsPerRow; // 8 товаров
  const visibleProducts = showAll ? products : products.slice(0, maxVisible);
  const hasMore = products.length > maxVisible;
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-xl mb-2">Товары и услуги</h2>
      <ProductList products={visibleProducts} />
      {hasMore && (
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setShowAll((v) => !v)}
          >
            {showAll ? 'Скрыть' : 'Показать больше'}
          </button>
        </div>
      )}
    </div>
  );
}

export default CompanyProductsProfileBlock;
