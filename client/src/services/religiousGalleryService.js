// Сервис для галерей (фотоальбомов) религиозных организаций
import { getApi } from './api';

const religiousGalleryService = {
  // Получить все альбомы организации
  getByOrganization: async (orgId) => {
    const api = await getApi();
    const response = await api.get(`/religious-galleries/organization/${orgId}`);
    return response.data;
  },
  // Получить один альбом
  getById: async (id) => {
    const api = await getApi();
    const response = await api.get(`/religious-galleries/${id}`);
    return response.data;
  },
  // Создать альбом
  create: async (data) => {
    const api = await getApi();
    const response = await api.post('/religious-galleries', data);
    return response.data;
  },
  // Обновить альбом
  update: async (id, data) => {
    const api = await getApi();
    const response = await api.put(`/religious-galleries/${id}`, data);
    return response.data;
  },
  // Удалить альбом
  remove: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/religious-galleries/${id}`);
    return response.data;
  },
};

export default religiousGalleryService;
