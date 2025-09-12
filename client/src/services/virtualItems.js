import { apiFetch } from './apiFetch';
import { API_BASE_URL } from '../config/api';

const virtualItemsService = {
  // Получить все цветы для мемориала
  async getFlowers(memorialId) {
    try {
  const response = await apiFetch(`${API_BASE_URL}/virtual/flowers/${memorialId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.flowers || [];
    } catch (error) {
      console.error('Error fetching flowers:', error);
      return [];
    }
  },

  // Добавить цветок
  async addFlower(memorialId, flowerData) {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
  const response = await apiFetch(`${API_BASE_URL}/virtual/flowers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          memorialId,
          ...flowerData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.flower;
    } catch (error) {
      console.error('Error adding flower:', error);
      throw error;
    }
  },

  // Получить все свечи для мемориала
  async getCandles(memorialId) {
    try {
  const response = await apiFetch(`${API_BASE_URL}/virtual/candles/${memorialId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.candles || [];
    } catch (error) {
      console.error('Error fetching candles:', error);
      return [];
    }
  },

  // Добавить свечу
  async addCandle(memorialId, candleData) {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      console.log('Token from localStorage:', !!token);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
  const response = await apiFetch(`${API_BASE_URL}/virtual/candles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          memorialId,
          ...candleData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.candle;
    } catch (error) {
      console.error('Error adding candle:', error);
      throw error;
    }
  },

  // Получить все предметы определённого типа (gift, prayer, note, dove)
  async getItems(type, memorialId) {
    try {
      const response = await apiFetch(`${API_BASE_URL}/virtual/${type}/${memorialId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.items || [];
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      return [];
    }
  },

  // Добавить предмет определённого типа (gift, prayer, note, dove)
  async addItem(type, memorialId, itemData) {
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await apiFetch(`${API_BASE_URL}/virtual/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          memorialId,
          ...itemData
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return result.item;
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      throw error;
    }
  }
};

export { virtualItemsService };
