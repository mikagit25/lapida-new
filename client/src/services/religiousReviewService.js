// Сервис для отзывов о религиозных организациях, услугах и товарах
import { getApi } from './api';

const religiousReviewService = {
  // Получить отзывы по организации
  getByOrganization: async (orgId) => {
    const api = await getApi();
    const response = await api.get(`/religious-reviews/organization/${orgId}`);
    return response.data;
  },
  // Получить отзывы по целевому объекту (услуга/товар)
  getByTarget: async (type, id) => {
    const api = await getApi();
    const response = await api.get(`/religious-reviews/target/${type}/${id}`);
    return response.data;
  },
  // Оставить отзыв
  create: async (data) => {
    const api = await getApi();
    const response = await api.post('/religious-reviews', data);
    return response.data;
  },
  // Удалить отзыв
  remove: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/religious-reviews/${id}`);
    return response.data;
  },
};

export default religiousReviewService;
