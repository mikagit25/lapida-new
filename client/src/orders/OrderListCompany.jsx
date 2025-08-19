import React, { useEffect, useState } from 'react';
import orderService from './orderService';

export default function OrderListCompany({ companyId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await orderService.getCompanyOrders(companyId);
        setOrders(data);
      } catch (e) {
        setError('Ошибка загрузки заказов компании');
      } finally {
        setLoading(false);
      }
    }
    if (companyId) fetchOrders();
  }, [companyId]);

  if (loading) return <div>Загрузка заказов компании...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Заказы компании</h2>
      {orders.length === 0 ? (
        <div>Нет заказов для этой компании.</div>
      ) : (
        <ul className="space-y-4">
          {orders.map(order => (
            <li key={order._id} className="border rounded p-4">
              <div>Статус: <b>{order.status}</b></div>
              <div>Клиент: {order.userId?.name || order.userId}</div>
              <div>Товары:
                <ul>
                  {order.items.map(item => (
                    <li key={item.productId}>{item.name} x {item.quantity} — {item.price}₴</li>
                  ))}
                </ul>
              </div>
              <div>Комментарий: {order.comment}</div>
              <div>Создан: {new Date(order.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
