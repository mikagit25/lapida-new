import React from 'react';

// Кнопка добавления товара в корзину
const AddToCartButton = ({ product }) => {
  const handleAdd = () => {
    const stored = localStorage.getItem('cartItems');
    let items = stored ? JSON.parse(stored) : [];
    const existing = items.find(item => item._id === product._id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      items.push({ ...product, quantity: 1, companyId: product.companyId });
    }
    localStorage.setItem('cartItems', JSON.stringify(items));
    alert('Товар добавлен в корзину');
  };

  return (
    <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold">
      В корзину
    </button>
  );
};

export default AddToCartButton;
