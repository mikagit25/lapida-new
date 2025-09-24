// Сервис для религиозных организаций (CRUD)
import { getApi } from './api';

const religiousOrgService = {
  // Получить список организаций
  getAll: async (filters = {}) => {
    const api = await getApi();
    const response = await api.get('/religious-organizations', { params: filters });
    return response.data;
  },

  // Получить одну организацию по id
  getById: async (id) => {
    const api = await getApi();
    const response = await api.get(`/religious-organizations/${id}`);
    return response.data;
  },

  // Создать организацию
  create: async (data) => {
    const api = await getApi();
    const response = await api.post('/religious-organizations', data);
    return response.data;
  },

  // Обновить организацию
  update: async (id, data) => {
    const api = await getApi();
    const response = await api.put(`/religious-organizations/${id}`, data);
    return response.data;
  },
  // Удалить организацию
  delete: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/religious-organizations/${id}`);
    return response.data;
  },
};

export default religiousOrgService;
