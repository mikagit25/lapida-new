import React from 'react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';

function CompanyProductsBlock({
  products,
  productsLoading,
  productsError,
  productFormOpen,
  isOwner,
  handleAddProduct,
  handleEditProduct,
  handleDeleteProduct,
  handleSaveProduct,
  productEditData,
  setProductFormOpen
}) {
  return (
    <div>
      <h2 className="font-semibold mb-2">Товары / услуги</h2>
      {productsLoading && <div className="text-gray-500">Загрузка...</div>}
      {productsError && <div className="text-red-600 mb-2">{productsError}</div>}
      {!productFormOpen && isOwner && (
        <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={handleAddProduct}>Добавить товар/услугу</button>
      )}
      {!productFormOpen && (
        <ProductList
          products={products}
          onEdit={isOwner ? handleEditProduct : undefined}
          onDelete={isOwner ? handleDeleteProduct : undefined}
        />
      )}
      {productFormOpen && (
        <ProductForm
          initialData={productEditData}
          onSave={handleSaveProduct}
          onCancel={() => setProductFormOpen(false)}
        />
      )}
    </div>
  );
}

export default CompanyProductsBlock;
