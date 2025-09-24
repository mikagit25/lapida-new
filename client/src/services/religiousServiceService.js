// Сервис для религиозных услуг (CRUD)
import { getApi } from './api';

const religiousServiceService = {
  // Получить все услуги организации
  getByOrganization: async (orgId) => {
    const api = await getApi();
    const response = await api.get(`/religious-services/organization/${orgId}`);
    return response.data;
  },

  // Получить одну услугу
  getById: async (id) => {
    const api = await getApi();
    const response = await api.get(`/religious-services/${id}`);
    return response.data;
  },

  // Создать услугу
  create: async (data) => {
    const api = await getApi();
    const response = await api.post('/religious-services', data);
    return response.data;
  },

  // Обновить услугу
  update: async (id, data) => {
    const api = await getApi();
    const response = await api.put(`/religious-services/${id}`, data);
    return response.data;
  },

  // Удалить услугу
  remove: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/religious-services/${id}`);
    return response.data;
  },
};

export default religiousServiceService;
