// Сервис для расписания церкви (службы, события)
import { getApi } from './api';

const religiousScheduleService = {
  // Получить расписание организации
  getByOrganization: async (orgId) => {
    const api = await getApi();
    const response = await api.get(`/religious-schedules/organization/${orgId}`);
    return response.data;
  },
  // Получить одно событие
  getById: async (id) => {
    const api = await getApi();
    const response = await api.get(`/religious-schedules/${id}`);
    return response.data;
  },
  // Создать событие
  create: async (data) => {
    const api = await getApi();
    const response = await api.post('/religious-schedules', data);
    return response.data;
  },
  // Обновить событие
  update: async (id, data) => {
    const api = await getApi();
    const response = await api.put(`/religious-schedules/${id}`, data);
    return response.data;
  },
  // Удалить событие
  remove: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/religious-schedules/${id}`);
    return response.data;
  },
};

export default religiousScheduleService;
