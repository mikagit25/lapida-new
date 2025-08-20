import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CompanyOrders = ({ companyId }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!companyId) return;
    setLoading(true);
    fetch(`/api/orders/company/${companyId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data.orders || []);
        setError('');
      })
      .catch(() => setError('Ошибка загрузки заказов'))
      .finally(() => setLoading(false));
  }, [companyId]);

  const handleStatusChange = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });
      if (res.ok) {
        setOrders(orders => orders.map(o => o._id === orderId ? { ...o, status } : o));
      }
    } catch {
      alert('Ошибка смены статуса');
    }
  };

  if (loading) return <div className="p-8">Загрузка заказов...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  const [filter, setFilter] = useState('all');
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Заказы компании</h2>
      <div className="mb-4">
        <label className="mr-2 font-medium">Фильтр по статусу:</label>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-2 py-1 border rounded">
          <option value="all">Все</option>
          <option value="new">Новый</option>
          <option value="pending">В обработке</option>
          <option value="confirmed">Подтвержден</option>
          <option value="shipped">Отправлен</option>
          <option value="completed">Выполнен</option>
          <option value="cancelled">Отменен</option>
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <div className="text-gray-500">Нет заказов по выбранному статусу</div>
      ) : (
        <ul className="space-y-4">
          {filteredOrders.map(order => (
            <li key={order._id} className="border-b pb-2">
              <div className="font-semibold">Заказ №{order._id}</div>
              <div>Статус: {order.status}</div>
              <div>Создан: {new Date(order.createdAt).toLocaleString()}</div>
              <div>Товары:
                <ul>
                  {order.items.map(item => (
                    <li key={item.productId}>{item.name} x {item.quantity} — {item.price}₴</li>
                  ))}
                </ul>
              </div>
              <select value={order.status} onChange={e => handleStatusChange(order._id, e.target.value)} className="mt-2 px-2 py-1 border rounded">
                <option value="new">Новый</option>
                <option value="pending">В обработке</option>
                <option value="confirmed">Подтвержден</option>
                <option value="shipped">Отправлен</option>
                <option value="completed">Выполнен</option>
                <option value="cancelled">Отменен</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CompanyOrders;
