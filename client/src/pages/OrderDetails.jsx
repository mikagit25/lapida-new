import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`/api/orders/${orderId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setOrder(data.order);
        setError('');
      })
      .catch(() => setError('Ошибка загрузки заказа'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="p-8">Загрузка заказа...</div>;
  if (error || !order) return <div className="p-8 text-red-600">{error || 'Заказ не найден'}</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Детали заказа №{order._id}</h2>
      <div className="mb-2">Статус: {order.status}</div>
      <div className="mb-2">Создан: {new Date(order.createdAt).toLocaleString()}</div>
      <div className="mb-2">Покупатель: {order.name || order.userId?.name}</div>
      <div className="mb-2">Телефон: {order.phone}</div>
      <div className="mb-2">Адрес: {order.address}</div>
      <div className="mb-2">Комментарий: {order.comment}</div>
      <div className="mb-2">Статус оплаты: {order.paymentStatus}</div>
      <div className="mb-4">Товары:
        <ul>
          {order.items.map(item => (
            <li key={item.productId}>{item.name} x {item.quantity} — {item.price}₴</li>
          ))}
        </ul>
      </div>
      {order.history && order.history.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">История изменений статуса</h3>
          <ul className="text-sm text-gray-700">
            {order.history.map((h, idx) => (
              <li key={idx}>
                {new Date(h.date).toLocaleString()} — <span className="font-bold">{h.status}</span> {h.comment && `(${h.comment})`}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
