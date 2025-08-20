
import { getApi } from '../services/api';

const orderService = {
  // Отменить заказ
  cancelOrder: async (orderId, comment = '') => {
    const api = await getApi();
    const res = await api.patch(`/orders/${orderId}/status`, { status: 'cancelled', comment });
    return res.data;
  },
  // Заказы пользователя
  getMyOrders: async () => {
  const api = await getApi();
  console.log('orderService.getMyOrders: api =', api);
  const res = await api.get('/orders/my');
  console.log('orderService.getMyOrders: res =', res);
  console.log('orderService.getMyOrders: res.data =', res.data);
  return res.data;
  },
  // Заказы компании
  getCompanyOrders: async (companyId) => {
    const api = await getApi();
    const res = await api.get(`/orders/company/${companyId}`);
    return res.data;
  },
  // Создать заказ
  createOrder: async (orderData) => {
    const api = await getApi();
    const res = await api.post('/orders', orderData);
    return res.data;
  },
  // Обновить заказ
  updateOrder: async (id, update) => {
    const api = await getApi();
    const res = await api.put(`/orders/${id}`, update);
    return res.data;
  },
  // Получить заказ по id
  getOrder: async (id) => {
    const api = await getApi();
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },
  // Удалить заказ
  deleteOrder: async (id) => {
    const api = await getApi();
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  }
};

export default orderService;
