import { getApi } from './api';

// Сервис для загрузки и удаления header background мемориала
const headerBackgroundService = {
  // Загрузка нового фона
  upload: async (memorialId, file) => {
    const api = await getApi();
    const formData = new FormData();
    formData.append('headerBackground', file);
    const response = await api.put(`/memorials/${memorialId}/header-background`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  // Удаление фона
  remove: async (memorialId) => {
    const api = await getApi();
    const response = await api.delete(`/memorials/${memorialId}/header-background`);
    return response.data;
  }
};

export default headerBackgroundService;
