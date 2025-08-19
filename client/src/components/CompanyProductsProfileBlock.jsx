import React from 'react';
import ProductList from './ProductList';

function CompanyProductsProfileBlock({ products }) {
  if (!products || products.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-xl mb-2">Товары и услуги</h2>
      <ProductList products={products} />
    </div>
  );
}

export default CompanyProductsProfileBlock;
