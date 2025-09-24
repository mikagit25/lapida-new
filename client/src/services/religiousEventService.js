import api from './api';

const ENDPOINT = '/religious-events';

const religiousEventService = {
  getAll: (organizationId) =>
    api.get(ENDPOINT + (organizationId ? `?organization=${organizationId}` : '')),
  getById: (id) => api.get(`${ENDPOINT}/${id}`),
  create: (data) => api.post(ENDPOINT, data),
  update: (id, data) => api.put(`${ENDPOINT}/${id}`, data),
  remove: (id) => api.delete(`${ENDPOINT}/${id}`),
  register: (id, registrationData) => api.post(`${ENDPOINT}/${id}/register`, registrationData),
};

export default religiousEventService;
