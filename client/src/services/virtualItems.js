import { getApiBaseUrl } from '../config/api';

const virtualItemsService = {
  // Получить все цветы для мемориала
  async getFlowers(memorialId) {
    try {
      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/virtual/flowers/${memorialId}`, {
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
      
      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/virtual/flowers`, {
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
      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/virtual/candles/${memorialId}`, {
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
      
      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/virtual/candles`, {
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
  }
};

export { virtualItemsService };
