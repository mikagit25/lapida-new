
import { findWorkingApiUrl, API_BASE_URL } from '../config/api-universal';
import axios from 'axios';

// Асинхронно определяем рабочий API URL
let apiInstance = null;
let apiBaseUrlPromise = null;

export function getApi() {
  if (apiInstance) return apiInstance;
  if (!apiBaseUrlPromise) {
    apiBaseUrlPromise = findWorkingApiUrl().catch(() => API_BASE_URL);
  }
  // Создаем axios instance после определения рабочего URL
  apiInstance = apiBaseUrlPromise.then(baseUrl => {
    // Не добавляем /api, если baseUrl уже содержит его на конце
    let finalBaseUrl = baseUrl;
    // Удаляем лишние /api, если их больше одного подряд
    finalBaseUrl = finalBaseUrl.replace(/(\/api)+$/, '/api');
    const instance = axios.create({
      baseURL: finalBaseUrl,
      // Можно добавить другие настройки по необходимости
    });

    // Интерцептор для автоматической передачи токена
    instance.interceptors.request.use(config => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    }, error => Promise.reject(error));

    return instance;
  });
  return apiInstance;
}

// Сервис аутентификации
const authService = {
  // Регистрация
  register: async (userData) => {
    const api = await getApi();
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Авторизация
  login: async (credentials) => {
    const api = await getApi();
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
    const api = await getApi();
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Обновление профиля
  updateProfile: async (userData) => {
    const api = await getApi();
    const config = {};
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
    const api = await getApi();
    const response = await api.put('/auth/change-password', passwordData);
    return response.data;
  },

  // Проверка токена
  verifyToken: async () => {
    const api = await getApi();
    const response = await api.get('/auth/verify');
    return response.data;
  },
};

// Сервис простых комментариев к фото
const photoCommentSimpleService = {
  // Получить все комментарии к фото
  getByPhoto: async (memorialId, photoUrl) => {
    const api = await getApi();
    const response = await api.get(`/photo-comments-simple/all`, { params: { memorialId, photoUrl } });
    return response.data;
  },
  // Добавить комментарий к фото
  add: async ({ memorialId, photoUrl, text, authorName }) => {
    const api = await getApi();
    const response = await api.post(`/photo-comments-simple/add`, { memorialId, photoUrl, text, authorName });
    return response.data;
  }
};


// Экспорт всех сервисов
export {
  authService,
  memorialService,
  photoCommentSimpleService,
  newMemorialService,
  commentService,
  timelineService,
  uploadService,
  userService,
  notificationService,
  friendsService,
};

// Сервис мемориалов
const memorialService = {
  // Добавление цветов
  addFlowers: async (id, flowerData) => {
    const api = await getApi();
    const response = await api.post(`/memorials/${id}/flowers`, flowerData);
    return response.data;
  },

  // Получение мемориалов пользователя
  getUserMemorials: async () => {
    const api = await getApi();
    const response = await api.get('/memorials/user/my');
    return response.data;
  },

  // Получение моих мемориалов с дополнительной информацией
  getMyMemorials: async (filters = {}) => {
    const api = await getApi();
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.order) params.append('order', filters.order);
    
    const response = await api.get(`/memorials/my?${params.toString()}`);
    return response.data;
  },

  // Обновление статуса мемориала
  updateStatus: async (memorialId, status) => {
    const api = await getApi();
    const response = await api.patch(`/memorials/${memorialId}/status`, { status });
    return response.data;
  },

  // Удаление мемориала
  removeMemorial: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/memorials/${id}`);
    return response.data;
  },
};

// Новые сервисы для обновленного API
const newMemorialService = {
  // Получение всех публичных мемориалов
  getAll: async (params = {}) => {
    const api = await getApi();
    const response = await api.get('/memorials', { params });
    return response.data.memorials || response.data; // Возвращаем массив мемориалов
  },

  // Получение мемориала по shareUrl
  getByShareUrl: async (shareUrl) => {
    const api = await getApi();
    const response = await api.get(`/memorials/share/${shareUrl}`);
    return response.data;
  },

  // Получение мемориала по customSlug
  getBySlug: async (slug) => {
    const api = await getApi();
    const response = await api.get(`/memorials/slug/${slug}`);
    return response.data;
  },

  // Получение мемориала по _id (fallback)
  getById: async (id) => {
    const api = await getApi();
    const response = await api.get(`/memorials/${id}`);
    return response.data;
  },

  // Получение мемориалов пользователя
  getMy: async (params = {}) => {
    const api = await getApi();
    const response = await api.get('/memorials/my', { params });
    return response.data;
  },

  // Создание мемориала
  create: async (memorialData) => {
    const api = await getApi();
    const response = await api.post('/memorials', memorialData);
    return response.data;
  },

  // Обновление мемориала
  update: async (id, memorialData) => {
    const api = await getApi();
    const response = await api.put(`/memorials/${id}`, memorialData);
    return response.data;
  },

  // Удаление мемориала
  remove: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/memorials/${id}`);
    return response.data;
  },

  // Обновление галереи мемориала
  updateGallery: async (id, galleryImages) => {
    const api = await getApi();
    const response = await api.patch(`/memorials/${id}/gallery`, { galleryImages });
    return response.data;
  },

  // Смена главной фотографии мемориала
  setProfileImage: async (id, profileImage) => {
    const api = await getApi();
    const response = await api.patch(`/memorials/${id}/profile-image`, { profileImage });
    return response.data;
  },
};

// Сервис комментариев
const commentService = {
  // Получение комментариев для мемориала
  getByMemorial: async (memorialId, params = {}) => {
    const api = await getApi();
    const response = await api.get(`/comments/memorial/${memorialId}`, { params });
    return response.data;
  },

  // Создание комментария
  create: async (commentData) => {
    const api = await getApi();
    const response = await api.post('/comments', commentData);
    return response.data;
  },

  // Обновление комментария
  update: async (id, commentData) => {
    const api = await getApi();
    const response = await api.put(`/comments/${id}`, commentData);
    return response.data;
  },

  // Удаление комментария
  remove: async (id) => {
    const api = await getApi();
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  // Модерация комментария
  approve: async (id, isApproved) => {
    const api = await getApi();
    const response = await api.patch(`/comments/${id}/approve`, { isApproved });
    return response.data;
  }
};

// Сервис временной линии (timeline)
const timelineService = {
  // Получение событий мемориала
  getByMemorial: async (memorialId, params = {}) => {
    const api = await getApi();
    const response = await api.get(`/timeline/timeline`, { params: { memorialId, ...params } });
    return response.data;
  },

  // Создание события
  create: async (memorialId, eventData) => {
    const api = await getApi();
    const response = await api.post(`/timeline/memorial/${memorialId}/timeline`, eventData);
    return response.data;
  },

  // Обновление события
  update: async (eventId, eventData) => {
    const api = await getApi();
    const response = await api.put(`/timeline/timeline/${eventId}`, eventData);
    return response.data;
  },

  // Удаление события
  remove: async (eventId) => {
    const api = await getApi();
    const response = await api.delete(`/timeline/timeline/${eventId}`);
    return response.data;
  },
};

// Сервис загрузки файлов
const uploadService = {
  // Удаление аватара пользователя
  removeAvatar: async () => {
    const api = await getApi();
    const response = await api.delete('/users/me/avatar');
    return response.data;
  },
  // Загрузка фото в галерею пользователя
  uploadUserGallery: async (formData) => {
    const api = await getApi();
    const response = await api.post('/users/me/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  // Удаление фото из галереи пользователя
  removeUserGallery: async (imageUrl) => {
    const api = await getApi();
    const response = await api.delete('/users/me/gallery', {
      data: { imageUrl }
    });
    return response.data;
  },
  // Загрузка одного файла
  uploadSingle: async (file) => {
  const apiInstance = await getApi();
  const formData = new FormData();
  formData.append('image', file);
  const response = await apiInstance.post('/upload/single', formData);
  return response.data;
  },

  // Загрузка нескольких файлов
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });
    const response = await api.post('/upload/gallery', formData);
    return response.data;
  },

  // Удаление файла
  removeFile: async (fileUrl) => {
    const api = await getApi();
    const response = await api.delete('/upload/file', { data: { fileUrl } });
    return response.data;
  }
};

// Сервис пользователя и статистики
const userService = {
  // Получение статистики пользователя
  getStats: async () => {
    const api = await getApi();
    const response = await api.get('/users/me/stats');
    return response.data;
  },

  // Получение комментариев пользователя
  getMyComments: async (params = {}) => {
    const api = await getApi();
    const response = await api.get('/users/me/comments', { params });
    return response.data;
  },

  // Обновление настроек пользователя
  updateSettings: async (settings) => {
    const api = await getApi();
    const response = await api.put('/users/me/settings', settings);
    return response.data;
  },

  // Обновление пароля
  updatePassword: async (passwordData) => {
    const api = await getApi();
    const response = await api.put('/users/me/password', passwordData);
    return response.data;
  },

  // Обновление настроек безопасности
  updateSecurity: async (securitySettings) => {
    const api = await getApi();
    const response = await api.put('/users/me/security', securitySettings);
    return response.data;
  },

  // Получение сессий пользователя
  getSessions: async () => {
    const api = await getApi();
    const response = await api.get('/users/me/sessions');
    return response.data;
  },

  // Завершение сессии
  terminateSession: async (sessionId) => {
    const api = await getApi();
    const response = await api.delete(`/users/me/sessions/${sessionId}`);
    return response.data;
  },

  // Завершение всех сессий кроме текущей
  terminateAllSessions: async () => {
    const api = await getApi();
    const response = await api.delete('/users/me/sessions/all');
    return response.data;
  },

  // Включение/отключение двухфакторной аутентификации
  toggle2FA: async (enabled, secret = null) => {
    const api = await getApi();
    const response = await api.put('/users/me/2fa', { enabled, secret });
    return response.data;
  },

  // Генерация секрета для 2FA
  generate2FASecret: async () => {
    const api = await getApi();
    const response = await api.get('/users/me/2fa/generate');
    return response.data;
  },

  // Обновление профиля пользователя
  updateProfile: async (profileData) => {
    const api = await getApi();
    const response = await api.put('/users/me/profile', profileData);
    return response.data;
  },

  // Получение мемориалов пользователя (алиас для memorialService.getMyMemorials)
  getMyMemorials: async (params = {}) => {
    const api = await getApi();
    const response = await api.get('/users/me/memorials', { params });
    return response.data;
  },

  // Обновление биографии пользователя
  updateBiography: async (biographyData) => {
    const api = await getApi();
    const response = await api.put('/users/me/biography', biographyData);
    return response.data;
  },

  // Загрузка аватара
  uploadAvatar: async (formData) => {
    const api = await getApi();
    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Удаление аватара
  deleteAvatar: async () => {
    const api = await getApi();
    const response = await api.delete('/users/me/avatar');
    return response.data;
  },

  // Получение истории активности
  getActivityHistory: async (filters = {}) => {
    const api = await getApi();
    const response = await api.get('/users/me/activity', { params: filters });
    return response.data;
  },

  clearActivityHistory: async () => {
    const api = await getApi();
    const response = await api.delete('/users/me/activity');
    return response.data;
  },

  // Получение предпочтений пользователя
  getPreferences: async () => {
    const api = await getApi();
    const response = await api.get('/users/me/preferences');
    return response.data;
  },

  // Обновление предпочтений пользователя
  updatePreferences: async (preferences) => {
    const api = await getApi();
    const response = await api.put('/users/me/preferences', preferences);
    return response.data;
  }
};

// Сервис уведомлений
const notificationService = {
  // Получение всех уведомлений пользователя
  getAll: async (params = {}) => {
    const api = await getApi();
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Получение количества непрочитанных уведомлений
  getUnreadCount: async () => {
    const api = await getApi();
    const response = await api.get('/notifications/unread-count');
    return response.data;
  },

  // Отметка уведомления как прочитанного
  markAsRead: async (notificationId) => {
    const api = await getApi();
    const response = await api.patch(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Отметка всех уведомлений как прочитанных
  markAllAsRead: async () => {
    const response = await api.patch('/notifications/mark-all-read');
    return response.data;
  },

  // Удаление уведомления
  remove: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  },

  // Очистка всех уведомлений
  clearAll: async () => {
    const response = await api.delete('/notifications/clear-all');
    return response.data;
  }
};

// Сервис друзей и социальных функций
const friendsService = {
  // Поиск пользователей
  searchUsers: async (query, params = {}) => {
    const response = await api.get('/users/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  // Получение списка друзей
  getFriends: async (userId = 'me', params = {}) => {
    const response = await api.get(`/users/${userId}/friends`, { params });
    return response.data;
  },

  // Получение заявок в друзья
  getFriendRequests: async (type = 'received') => {
    const response = await api.get(`/friends/requests/${type}`);
    return response.data;
  },

  // Отправка заявки в друзья
  sendFriendRequest: async (userId) => {
    const response = await api.post(`/friends/request/${userId}`);
    return response.data;
  },

  // Одобрение заявки в друзья
  acceptFriendRequest: async (requestId) => {
    const response = await api.patch(`/friends/requests/${requestId}/accept`);
    return response.data;
  },

  // Отклонение заявки в друзья
  rejectFriendRequest: async (requestId) => {
    const response = await api.patch(`/friends/requests/${requestId}/reject`);
    return response.data;
  },

  // Удаление из друзей
  removeFriend: async (userId) => {
    const response = await api.delete(`/friends/${userId}`);
    return response.data;
  },

  // Блокировка пользователя
  blockUser: async (userId) => {
    const response = await api.post(`/users/${userId}/block`);
    return response.data;
  },

  // Разблокировка пользователя
  unblockUser: async (userId) => {
    const response = await api.delete(`/users/${userId}/block`);
    return response.data;
  },

  // Получение заблокированных пользователей
  getBlockedUsers: async () => {
    const response = await api.get('/users/blocked');
    return response.data;
  }
};

// Messages Service - Система сообщений
const messagesService = {
  // Получить список чатов пользователя
  getChats: async () => {
    const response = await api.get('/messages/chats');
    return response.data;
  },
  
  // Получить сообщения в чате
  getMessages: async (chatId, page = 1, limit = 50) => {
    const response = await api.get(`/messages/chat/${chatId}?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  // Отправить сообщение
  sendMessage: async (recipientId, content, attachments = []) => {
    const response = await api.post('/messages/send', { recipientId, content, attachments });
    return response.data;
  },
  
  // Отметить сообщения как прочитанные
  markAsRead: async (chatId) => {
    const response = await api.post(`/messages/chat/${chatId}/read`);
    return response.data;
  },
  
  // Удалить сообщение
  deleteMessage: async (messageId) => {
    const response = await api.delete(`/messages/${messageId}`);
    return response.data;
  },
  
  // Поиск в сообщениях
  searchMessages: async (query, chatId = null) => {
    const response = await api.get('/messages/search', { params: { query, chatId } });
    return response.data;
  },
};
