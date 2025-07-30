import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки ответов
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Удаляем токен при ошибке авторизации
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Сервис аутентификации
export const authService = {
  // Регистрация
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Авторизация
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Выход
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Получение профиля
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Обновление профиля
  updateProfile: async (userData) => {
    const config = {};
    
    // Если userData это FormData, устанавливаем правильный заголовок
    if (userData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data'
      };
    }
    
    const response = await api.put('/auth/profile', userData, config);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },

  // Изменение пароля
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Проверка токена
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Сервис мемориалов
export const memorialService = {
  // Получение всех мемориалов
  getMemorials: async (params = {}) => {
    const response = await api.get('/memorials', { params });
    return response.data;
  },

  // Получение мемориала по ID
  getMemorial: async (id) => {
    const response = await api.get(`/memorials/${id}`);
    return response.data;
  },

  // Создание мемориала
  createMemorial: async (memorialData) => {
    const response = await api.post('/memorials', memorialData);
    return response.data;
  },

  // Обновление мемориала
  updateMemorial: async (id, memorialData) => {
    const response = await api.put(`/memorials/${id}`, memorialData);
    return response.data;
  },

  // Удаление мемориала
  deleteMemorial: async (id) => {
    const response = await api.delete(`/memorials/${id}`);
    return response.data;
  },

  // Добавление послания
  addTribute: async (id, message) => {
    const response = await api.post(`/memorials/${id}/tributes`, { message });
    return response.data;
  },

  // Добавление цветов
  addFlowers: async (id, flowerData) => {
    const response = await api.post(`/memorials/${id}/flowers`, flowerData);
    return response.data;
  },

  // Получение мемориалов пользователя
  getUserMemorials: async () => {
    const response = await api.get('/memorials/user/my');
    return response.data;
  },
};

// Новые сервисы для обновленного API
export const newMemorialService = {
  // Получение всех публичных мемориалов
  getAll: async (params = {}) => {
    const response = await api.get('/memorials', { params });
    return response.data.memorials || response.data; // Возвращаем массив мемориалов
  },

  // Получение мемориала по shareUrl
  getByShareUrl: async (shareUrl) => {
    const response = await api.get(`/memorials/share/${shareUrl}`);
    return response.data;
  },

  // Получение мемориала по customSlug (красивая ссылка)
  getBySlug: async (slug) => {
    const response = await api.get(`/memorials/slug/${slug}`);
    return response.data;
  },

  // Получение мемориалов пользователя
  getMy: async (params = {}) => {
    const response = await api.get('/memorials/my', { params });
    return response.data;
  },

  // Создание мемориала
  create: async (memorialData) => {
    const response = await api.post('/memorials', memorialData);
    return response.data;
  },

  // Обновление мемориала
  update: async (id, memorialData) => {
    const response = await api.put(`/memorials/${id}`, memorialData);
    return response.data;
  },

  // Удаление мемориала
  delete: async (id) => {
    const response = await api.delete(`/memorials/${id}`);
    return response.data;
  },

  // Обновление галереи мемориала
  updateGallery: async (id, galleryImages) => {
    const response = await api.patch(`/memorials/${id}/gallery`, { galleryImages });
    return response.data;
  }
};

// Сервис комментариев
export const commentService = {
  // Получение комментариев для мемориала
  getByMemorial: async (memorialId, params = {}) => {
    const response = await api.get(`/comments/memorial/${memorialId}`, { params });
    return response.data;
  },

  // Создание комментария
  create: async (commentData) => {
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // Обновление комментария
  update: async (id, commentData) => {
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  },

  // Удаление комментария
  delete: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  // Модерация комментария
  approve: async (id, isApproved) => {
    const response = await api.patch(`/comments/${id}/approve`, { isApproved });
    return response.data;
  }
};

// Сервис временной линии (timeline)
export const timelineService = {
  // Получение событий мемориала
  getByMemorial: async (memorialId, params = {}) => {
    const response = await api.get(`/timeline/timeline`, { params: { memorialId, ...params } });
    return response.data;
  },

  // Создание события
  create: async (memorialId, eventData) => {
    const response = await api.post(`/timeline/memorial/${memorialId}/timeline`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Обновление события
  update: async (eventId, eventData) => {
    const response = await api.put(`/timeline/timeline/${eventId}`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Удаление события
  delete: async (eventId) => {
    const response = await api.delete(`/timeline/timeline/${eventId}`);
    return response.data;
  }
};

// Сервис загрузки файлов
export const uploadService = {
  // Загрузка одного файла
  uploadSingle: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Загрузка нескольких файлов
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await api.post('/upload/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Удаление файла
  deleteFile: async (fileUrl) => {
    const response = await api.delete('/upload/file', { data: { fileUrl } });
    return response.data;
  }
};

// Сервис пользователя и статистики
export const userService = {
  // Получение статистики пользователя
  getStats: async () => {
    const response = await api.get('/users/me/stats');
    return response.data;
  },

  // Получение мемориалов пользователя
  getMyMemorials: async (params = {}) => {
    const response = await api.get('/users/me/memorials', { params });
    return response.data;
  },

  // Получение комментариев пользователя
  getMyComments: async (params = {}) => {
    const response = await api.get('/users/me/comments', { params });
    return response.data;
  },

  // Обновление настроек пользователя
  updateSettings: async (settings) => {
    const response = await api.put('/users/me/settings', settings);
    return response.data;
  }
};

// Общий экспорт
export default api;
