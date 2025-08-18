import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
      {product.images && product.images.length > 0 ? (
        <img src={product.images[0]} alt={product.name} className="w-full h-40 object-cover rounded mb-2" />
      ) : (
        <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded mb-2 text-gray-400 text-4xl">🛒</div>
      )}
      <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h3>
      <div className="text-gray-600 mb-1 line-clamp-1">{product.category}</div>
      <div className="text-blue-700 font-bold mb-2">{product.price ? product.price + ' ₽' : 'Цена не указана'}</div>
      <div className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</div>
      <Link to={`/companies/${product.companyId}`} className="text-blue-600 hover:underline text-sm mt-auto mb-2">{product.companyName}</Link>
      <Link to={`/products/${product.slug || product._id}`} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold text-center mt-2 hover:bg-blue-700 transition">
        Просмотреть товар
      </Link>
    </div>
  );
};

export default ProductCard;
