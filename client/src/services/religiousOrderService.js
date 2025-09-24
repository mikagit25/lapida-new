// Сервис для заказов на услуги и товары религиозных организаций
import { getApi } from './api';

const religiousOrderService = {
  // Заказы на услуги
  getServiceOrdersByOrg: async (orgId) => {
    const api = await getApi();
    const response = await api.get(`/religious-service-orders/organization/${orgId}`);
    return response.data;
  },
  getMyServiceOrders: async () => {
    const api = await getApi();
    const response = await api.get('/religious-service-orders/my');
    return response.data;
  },
  createServiceOrder: async (data) => {
    const api = await getApi();
    const response = await api.post('/religious-service-orders', data);
    return response.data;
  },
  updateServiceOrder: async (id, data) => {
    const api = await getApi();
    const response = await api.put(`/religious-service-orders/${id}`, data);
    return response.data;
  },
  removeServiceOrder: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/religious-service-orders/${id}`);
    return response.data;
  },

  // Заказы на товары
  getProductOrdersByOrg: async (orgId) => {
    const api = await getApi();
    const response = await api.get(`/religious-product-orders/organization/${orgId}`);
    return response.data;
  },
  getMyProductOrders: async () => {
    const api = await getApi();
    const response = await api.get('/religious-product-orders/my');
    return response.data;
  },
  createProductOrder: async (data) => {
    const api = await getApi();
    const response = await api.post('/religious-product-orders', data);
    return response.data;
  },
  updateProductOrder: async (id, data) => {
    const api = await getApi();
    const response = await api.put(`/religious-product-orders/${id}`, data);
    return response.data;
  },
  removeProductOrder: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/religious-product-orders/${id}`);
    return response.data;
  },
};

export default religiousOrderService;
