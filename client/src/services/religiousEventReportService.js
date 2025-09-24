import api from './api';

const ENDPOINT = '/religious-event-reports';

const religiousEventReportService = {
  getAll: (eventId) =>
    api.get(ENDPOINT + (eventId ? `?event=${eventId}` : '')),
  getById: (id) => api.get(`${ENDPOINT}/${id}`),
  create: (data) => api.post(ENDPOINT, data),
  update: (id, data) => api.put(`${ENDPOINT}/${id}`, data),
  remove: (id) => api.delete(`${ENDPOINT}/${id}`),
};

export default religiousEventReportService;
