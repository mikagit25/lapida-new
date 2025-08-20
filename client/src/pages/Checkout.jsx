import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Страница оформления заказа
const Checkout = () => {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('cartItems');
    setItems(stored ? JSON.parse(stored) : []);
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // Получаем companyId из первого товара корзины (companyId или company)
      const companyId = items.length > 0 ? (items[0].companyId || items[0].company) : null;
      // Формируем items с productId для каждого товара
      const orderItems = items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        companyId: item.companyId
      }));
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ companyId, items: orderItems, name, phone, address })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        localStorage.removeItem('cartItems');
      } else {
        setError(data.message || 'Ошибка оформления заказа');
      }
    } catch (e) {
      setError('Ошибка оформления заказа');
    }
  };

  if (success) {
    return <div className="max-w-xl mx-auto p-6 bg-white rounded shadow text-green-700">Заказ успешно оформлен!</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Оформление заказа</h2>
      {items.length === 0 ? (
        <div className="text-gray-500">Корзина пуста</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Имя</label>
            <input value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Телефон</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Адрес</label>
            <input value={address} onChange={e => setAddress(e.target.value)} required className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Товары</h3>
            <ul className="space-y-2">
              {items.map(item => (
                <li key={item._id}>
                  {item.name} x {item.quantity || 1} — {item.price}₴
                </li>
              ))}
            </ul>
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-semibold">Оформить заказ</button>
        </form>
      )}
    </div>
  );
};

export default Checkout;
