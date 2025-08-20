import React, { useState, useEffect } from 'react';

// Корзина: хранит товары в localStorage
const Cart = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cartItems');
    setItems(stored ? JSON.parse(stored) : []);
  }, []);

  const removeItem = (id) => {
    const updated = items.filter(item => item._id !== id);
    setItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Корзина</h2>
      {items.length === 0 ? (
        <div className="text-gray-500">Корзина пуста</div>
      ) : (
        <ul className="space-y-4">
          {items.map(item => (
            <li key={item._id} className="flex justify-between items-center border-b pb-2">
              <div>
                <div className="font-semibold">{item.name}</div>
                <div className="text-gray-600">Цена: {item.price}₴</div>
                <div className="text-gray-600">Количество: {item.quantity || 1}</div>
              </div>
              <button onClick={() => removeItem(item._id)} className="text-red-600 hover:underline">Удалить</button>
            </li>
          ))}
        </ul>
      )}
      {/* Кнопка перехода к оформлению заказа */}
      {items.length > 0 && (
        <a href="/checkout" className="mt-6 block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-center font-semibold">Оформить заказ</a>
      )}
    </div>
  );
};

export default Cart;
