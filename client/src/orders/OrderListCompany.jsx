import React, { useEffect, useState } from 'react';
import orderService from './orderService';
import OrderProductCard from './OrderProductCard';
import OrderBuyerInfo from './OrderBuyerInfo';
import OrderStatusBadge from './OrderStatusBadge';
import OrderProductsList from './OrderProductsList';

export default function OrderListCompany({ companyId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        console.log('[OrderListCompany] companyId:', companyId);
        const data = await orderService.getCompanyOrders(companyId);
        console.log('[OrderListCompany] API response:', data);
        const ordersArr = Array.isArray(data.orders) ? data.orders : [];
        setOrders(ordersArr);
        // Логируем каждый заказ
        ordersArr.forEach(order => {
          console.log('[OrderListCompany] order:', order);
        });
      } catch (e) {
        setError('Ошибка загрузки заказов компании');
        console.error('[OrderListCompany] API error:', e);
      } finally {
        setLoading(false);
      }
    }
    if (companyId) fetchOrders();
  }, [companyId]);

  if (loading) return <div>Загрузка заказов компании...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  // Защита: orders всегда массив
  const safeOrders = Array.isArray(orders) ? orders : [];
  if (!Array.isArray(orders)) {
    console.warn('OrderListCompany: orders is not array', orders);
  }
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Заказы компании</h2>
      {safeOrders.length === 0 ? (
        <div>Нет заказов для этой компании.</div>
      ) : (
        <ul className="space-y-4">
          {safeOrders.map(order => (
            <li key={order._id} className="border rounded p-4">
                <li key={order._id} className="border rounded-lg p-4 shadow-sm bg-white">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <OrderStatusBadge status={order.status} />
                      <span className="text-gray-500 text-xs">{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mb-2">
                      <b>Покупатель:</b>
                      <OrderBuyerInfo user={{
                        name: order.name || order.userId?.name,
                        phone: order.phone || order.userId?.phone,
                        email: order.userId?.email,
                        address: order.address || order.userId?.address
                      }} />
                    </div>
                    <div>
                      <b>Товары:</b>
                      <OrderProductsList items={order.items} />
                    </div>
                  </div>
                </li>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
