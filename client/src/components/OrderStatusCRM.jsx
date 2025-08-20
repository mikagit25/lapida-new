import React, { useEffect, useState } from 'react';
import { getOrderStatus } from '../services/crmService';

const OrderStatusCRM = ({ orderId }) => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    getOrderStatus(orderId)
      .then(res => {
        setStatus(res.data.status || 'Неизвестно');
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка получения статуса заказа');
        setLoading(false);
      });
  }, [orderId]);

  if (!orderId) return <div>Нет заказа</div>;
  if (loading) return <div>Загрузка статуса заказа...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <strong>Статус заказа:</strong> {status}
    </div>
  );
};

export default OrderStatusCRM;
