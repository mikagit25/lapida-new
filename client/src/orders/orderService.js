import axios from 'axios';

const API_URL = '/api/orders';

// Получить заголовки авторизации
function getAuthHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const orderService = {
  // Заказы пользователя
  getMyOrders: async () => {
    const res = await axios.get(`${API_URL}/my`, { headers: getAuthHeaders() });
    return res.data;
  },
  // Заказы компании
  getCompanyOrders: async (companyId) => {
    const res = await axios.get(`${API_URL}/company/${companyId}`, { headers: getAuthHeaders() });
    return res.data;
  },
  // Создать заказ
  createOrder: async (orderData) => {
    const res = await axios.post(`${API_URL}`, orderData, { headers: getAuthHeaders() });
    return res.data;
  },
  // Обновить заказ
  updateOrder: async (id, update) => {
    const res = await axios.put(`${API_URL}/${id}`, update, { headers: getAuthHeaders() });
    return res.data;
  },
  // Получить заказ по id
  getOrder: async (id) => {
    const res = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  },
  // Удалить заказ
  deleteOrder: async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  }
};

export default orderService;
