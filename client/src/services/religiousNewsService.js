import api from './api';

const ENDPOINT = '/religious-news';

const religiousNewsService = {
  getAll: (organizationId) =>
    api.get(ENDPOINT + (organizationId ? `?organization=${organizationId}` : '')),
  getById: (id) => api.get(`${ENDPOINT}/${id}`),
  create: (data) => api.post(ENDPOINT, data),
  update: (id, data) => api.put(`${ENDPOINT}/${id}`, data),
  remove: (id) => api.delete(`${ENDPOINT}/${id}`),
};

export default religiousNewsService;
