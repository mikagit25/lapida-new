import { getApi } from './api';

const orgsService = {
  // Catalog with filters
  list: async (params = {}) => {
    const api = await getApi();
    const res = await api.get('/orgs', { params });
    return res.data;
  },
  // Detail by slug
  getBySlug: async (slug) => {
    const api = await getApi();
    const res = await api.get(`/orgs/${slug}`);
    return res.data;
  },
  // Create lead (public)
  createLead: async (payload) => {
    const api = await getApi();
    const res = await api.post('/org-leads', payload);
    return res.data;
  },
  // List services by organization
  listServices: async (orgId, params = {}) => {
    const api = await getApi();
    const res = await api.get(`/org-services/org/${orgId}`, { params });
    return res.data;
  },
  // Get service by id (public)
  getService: async (serviceId) => {
    const api = await getApi();
    const res = await api.get(`/org-services/${serviceId}`);
    return res.data;
  }
};

export default orgsService;
