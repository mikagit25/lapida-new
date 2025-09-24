// Сервис для религиозных товаров (CRUD)
import { getApi } from './api';

const religiousProductService = {
  // Получить все товары организации
  getByOrganization: async (orgId) => {
    const api = await getApi();
    const response = await api.get(`/religious-products/organization/${orgId}`);
    return response.data;
  },

  // Получить один товар
  getById: async (id) => {
    const api = await getApi();
    const response = await api.get(`/religious-products/${id}`);
    return response.data;
  },

  // Создать товар
  create: async (data) => {
    const api = await getApi();
    const response = await api.post('/religious-products', data);
    return response.data;
  },

  // Обновить товар
  update: async (id, data) => {
    const api = await getApi();
    const response = await api.put(`/religious-products/${id}`, data);
    return response.data;
  },

  // Удалить товар
  remove: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/religious-products/${id}`);
    return response.data;
  },
};

export default religiousProductService;
