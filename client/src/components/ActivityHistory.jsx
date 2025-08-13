import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ActivityHistory = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activities, setActivities] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: '30',
    page: 1,
    limit: 20
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadActivities();
  }, [filters]);

  const loadActivities = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await userService.getActivityHistory(filters);
      setActivities(response?.activities || []);
      setTotalPages(response?.totalPages || 1);
    } catch (error) {
      console.error('Error loading activities:', error);
      setError('Ошибка загрузки истории активности');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      memorial_created: '🏛️',
      memorial_updated: '✏️',
      memorial_deleted: '🗑️',
      comment_posted: '💬',
      comment_deleted: '🗑️',
      friend_added: '👥',
      friend_removed: '👥',
      message_sent: '📧',
      profile_updated: '👤',
      settings_changed: '⚙️',
      login: '🔑',
      logout: '🚪',
      password_changed: '🔒',
      avatar_uploaded: '📸',
      file_uploaded: '📎',
      tribute_added: '💐'
    };
    return icons[type] || '📋';
  };

  const getActivityTitle = (activity) => {
    const titles = {
      memorial_created: 'Создан мемориал',
      memorial_updated: 'Обновлен мемориал',
      memorial_deleted: 'Удален мемориал',
      comment_posted: 'Добавлен комментарий',
      comment_deleted: 'Удален комментарий',
      friend_added: 'Добавлен друг',
      friend_removed: 'Удален из друзей',
      message_sent: 'Отправлено сообщение',
      profile_updated: 'Обновлен профиль',
      settings_changed: 'Изменены настройки',
      login: 'Вход в систему',
      logout: 'Выход из системы',
      password_changed: 'Изменен пароль',
      avatar_uploaded: 'Обновлен аватар',
      file_uploaded: 'Загружен файл',
      tribute_added: 'Добавлено послание'
    };
    return titles[activity.type] || 'Активность';
  };

  const getActivityDescription = (activity) => {
    if (activity.description) return activity.description;
    
    switch (activity.type) {
      case 'memorial_created':
        return `Создан мемориал "${activity.metadata?.memorialName || 'Без названия'}"`;
      case 'memorial_updated':
        return `Обновлен мемориал "${activity.metadata?.memorialName || 'Без названия'}"`;
      case 'comment_posted':
        return `Добавлен комментарий к мемориалу "${activity.metadata?.memorialName || 'Без названия'}"`;
      case 'friend_added':
        return `Добавлен в друзья: ${activity.metadata?.friendName || 'Пользователь'}`;
      case 'message_sent':
        return `Отправлено сообщение пользователю ${activity.metadata?.recipientName || 'Неизвестно'}`;
      case 'login':
        return `Вход с IP: ${activity.metadata?.ip || 'Неизвестно'}`;
      default:
        return 'Активность пользователя';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дней назад`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} недель назад`;
    
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Сброс на первую страницу при изменении фильтров
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const clearHistory = async () => {
    if (!window.confirm('Вы уверены, что хотите очистить всю историю активности?')) {
      return;
    }

    setLoading(true);
    try {
      await userService.clearActivityHistory();
      setActivities([]);
      setError('');
    } catch (error) {
      console.error('Error clearing history:', error);
      setError('Ошибка при очистке истории');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">История активности</h2>
            <p className="text-sm text-gray-600">Ваши действия на сайте</p>
          </div>
          <button
            onClick={clearHistory}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Очистить историю
          </button>
        </div>
      </div>

      {/* Фильтры */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип активности
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все действия</option>
              <option value="memorial">Мемориалы</option>
              <option value="comment">Комментарии</option>
              <option value="social">Социальные</option>
              <option value="profile">Профиль</option>
              <option value="security">Безопасность</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Период
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">Последние 7 дней</option>
              <option value="30">Последние 30 дней</option>
              <option value="90">Последние 3 месяца</option>
              <option value="365">Последний год</option>
              <option value="all">Все время</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Показать
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="10">10 записей</option>
              <option value="20">20 записей</option>
              <option value="50">50 записей</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Загрузка истории...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">📋</div>
            <p className="text-gray-500">История активности пуста</p>
            <p className="text-gray-400 text-sm mt-2">
              Здесь будут отображаться ваши действия на сайте
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <span className="text-2xl" role="img" aria-label="activity">
                    {getActivityIcon(activity.type)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {getActivityTitle(activity)}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {getActivityDescription(activity)}
                      </p>
                      
                      {activity.metadata?.details && (
                        <div className="mt-2">
                          <details className="text-xs text-gray-500">
                            <summary className="cursor-pointer hover:text-gray-700">
                              Подробности
                            </summary>
                            <pre className="mt-1 whitespace-pre-wrap">
                              {JSON.stringify(activity.metadata.details, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.createdAt)}
                      </p>
                      {activity.metadata?.ip && (
                        <p className="text-xs text-gray-400 mt-1">
                          IP: {activity.metadata.ip}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-700">
                  Страница {filters.page} из {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Назад
                  </button>
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Вперед
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistory;