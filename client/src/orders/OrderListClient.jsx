import React, { useEffect, useState } from 'react';
import OrderCard from './OrderCard';
import OrderFilter from './OrderFilter';
import orderService from './orderService';

export default function OrderListClient() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // Действия над заказом
  const handleCancel = async (order) => {
    if (!window.confirm('Вы уверены, что хотите отменить заказ?')) return;
    try {
      await orderService.cancelOrder(order._id, 'Отменено клиентом');
      setOrders(prev => prev.map(o => o._id === order._id ? { ...o, status: 'cancelled' } : o));
    } catch (e) {
      alert('Ошибка отмены заказа: ' + (e?.message || e));
    }
  };
  const handleRepeat = async (order) => {
    if (!window.confirm('Создать новый заказ с теми же товарами?')) return;
    try {
      const newOrder = await orderService.createOrder({
        companyId: order.companyId?._id || order.companyId,
        items: order.items.map(item => {
          // Если productId отсутствует, попытаться найти по имени (или оставить пустым)
          let productId = item.productId ? (item.productId._id || item.productId) : undefined;
          return {
            productId,
            quantity: item.quantity,
            price: item.productId?.price ?? item.price,
            name: item.productId?.name || item.name,
            companyId: item.companyId?._id || item.companyId
          };
        }),
        comment: 'Повтор заказа ' + order._id
      });
      setOrders(prev => [newOrder, ...prev]);
    } catch (e) {
      alert('Ошибка повтора заказа: ' + (e?.message || e));
    }
  };
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await orderService.getMyOrders();
        if (data && data.length > 0) {
          console.log('DEBUG: order', JSON.stringify(data[0], null, 2));
        } else {
          console.log('DEBUG: order', data);
        }
        setOrders(data);
      } catch (e) {
        setError('Ошибка загрузки заказов');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) return <div>Загрузка заказов...</div>;
  if (error) return <div className="text-red-600">{error}<br/>Debug: {window.__ordersDebug && JSON.stringify(window.__ordersDebug)}</div>;

  // Фильтрация заказов по статусу
  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-0">
      <h2 className="text-2xl font-bold mb-6 text-center">Мои заказы</h2>
      <div className="mb-4 flex justify-center">
        <OrderFilter value={filter} onChange={setFilter} />
      </div>
      {filteredOrders.length === 0 ? (
        <div className="text-center text-gray-500">У вас нет заказов по выбранному фильтру.</div>
      ) : (
        <ul className="space-y-6">
              {filteredOrders.map((order) => (
                <li key={order._id}>
                  <OrderCard order={order} onCancel={handleCancel} onRepeat={handleRepeat} key={order._id} />
                </li>
              ))}
        </ul>
      )}
    </div>
  );
}
