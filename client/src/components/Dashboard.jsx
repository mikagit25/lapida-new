import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, notificationService } from '../services/api';
import DashboardStats from './DashboardStats';
import { fixImageUrl } from '../utils/imageUrl';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    memorialsCreated: 0,
    flowersLeft: 0,
    commentsLeft: 0,
    totalViews: 0
  });
  const [recentMemorials, setRecentMemorials] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Загружаем статистику
      const userStats = await userService.getStats().catch(err => {
        console.log('Stats error:', err);
        return { memorialsCreated: 0, flowersLeft: 0, commentsLeft: 0, totalViews: 0 };
      });

      // Загружаем мемориалы
      const memorialsData = await userService.getMyMemorials({ limit: 5 }).catch(err => {
        console.log('Memorials error:', err);
        return { memorials: [] };
      });

      // Загружаем активность
      const activityData = await userService.getMyComments({ limit: 5 }).catch(err => {
        console.log('Comments error:', err);
        return { comments: [] };
      });

      // Загружаем уведомления (пока заглушка)
      const notificationsData = await notificationService.getAll({ limit: 5 }).catch(err => {
        console.log('Notifications error:', err);
        return [];
      });

      setStats({
        memorialsCreated: userStats.memorialsCreated || 0,
        flowersLeft: userStats.flowersLeft || 0,
        commentsLeft: userStats.commentsLeft || 0,
        totalViews: userStats.totalViews || 0
      });

      setRecentMemorials(memorialsData.memorials || []);
      setRecentActivity(activityData.comments || []);
      setNotifications(Array.isArray(notificationsData) ? notificationsData : notificationsData.notifications || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Ошибка при загрузке данных дашборда');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getActivityIcon = (comment) => {
    if (comment.isFlower) return '🌸';
    if (comment.type === 'photo') return '📷';
    return '💬';
  };

  const getActivityText = (comment) => {
    if (comment.isFlower) return 'Оставили цветы';
    if (comment.type === 'photo') return 'Комментарий к фото';
    return 'Комментарий';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Добро пожаловать в Lapida</h2>
          <p className="text-gray-600 mb-8">Войдите в систему, чтобы получить доступ к вашему дашборду</p>
          <div className="space-y-4">
            <Link
              to="/login"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors block"
            >
              Войти
            </Link>
            <Link
              to="/register"
              className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors block"
            >
              Регистрация
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка дашборда...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок дашборда */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Добро пожаловать, {user.name}!
          </h1>
          <p className="mt-2 text-gray-600">
            Обзор вашей активности на платформе Lapida
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {/* Статистика */}
        <DashboardStats
          memorials={recentMemorials}
          comments={recentActivity}
          views={stats.totalViews}
        />

        {/* Основная сетка дашборда */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Быстрые действия и последние мемориалы */}
          <div className="lg:col-span-2 space-y-6">
            {/* Быстрые действия */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Быстрые действия</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/create-memorial"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xl">🏛️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Создать мемориал</h3>
                    <p className="text-xs text-gray-500">Новая мемориальная страница</p>
                  </div>
                </Link>

                <Link
                  to="/profile?tab=personal"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xl">📝</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Редактировать профиль</h3>
                    <p className="text-xs text-gray-500">Обновить личные данные</p>
                  </div>
                </Link>

                <Link
                  to="/memorials"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xl">🔍</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Просмотр мемориалов</h3>
                    <p className="text-xs text-gray-500">Все мемориалы платформы</p>
                  </div>
                </Link>

                <Link
                  to="/profile?tab=preferences"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-xl">⚙️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Настройки</h3>
                    <p className="text-xs text-gray-500">Предпочтения и приватность</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Последние мемориалы */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Мои мемориалы</h2>
                <Link
                  to="/profile?tab=memorials"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Все мемориалы →
                </Link>
              </div>

              {recentMemorials.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">🏛️</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Нет мемориалов</h3>
                  <p className="text-gray-500 mb-4">Создайте первый мемориал для сохранения памяти</p>
                  <Link
                    to="/create-memorial"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Создать мемориал
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMemorials.map((memorial) => (
                    <div key={memorial._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      {memorial.photo && (
                        <img
                          src={fixImageUrl(memorial.photo)}
                          alt={`${memorial.firstName} ${memorial.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {memorial.firstName} {memorial.lastName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Создан {formatDate(memorial.createdAt)}
                        </p>
                        {memorial.views && (
                          <p className="text-xs text-gray-400">
                            {memorial.views} просмотр{memorial.views === 1 ? '' : memorial.views < 5 ? 'а' : 'ов'}
                          </p>
                        )}
                      </div>
                      <Link
                        to={memorial.customSlug ? `/${memorial.customSlug}` : `/memorial/${memorial._id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Открыть
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Правая колонка - Уведомления и активность */}
          <div className="space-y-6">
            {/* Уведомления */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Уведомления</h2>
                <Link
                  to="/profile?tab=activity"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Все →
                </Link>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-gray-400 text-3xl mb-2">🔔</div>
                  <p className="text-gray-500 text-sm">Нет новых уведомлений</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.slice(0, 5).map((notification) => (
                    <div key={notification._id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">📩</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Последняя активность */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Моя активность</h2>
                <Link
                  to="/profile?tab=my-activity"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Все →
                </Link>
              </div>

              {recentActivity.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-gray-400 text-3xl mb-2">💬</div>
                  <p className="text-gray-500 text-sm">Нет активности</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.slice(0, 5).map((activity) => (
                    <div key={activity._id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <span className="text-lg">{getActivityIcon(activity)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          {getActivityText(activity)}
                        </p>
                        {activity.memorial && (
                          <p className="text-xs text-gray-600">
                            {activity.memorial.firstName} {activity.memorial.lastName}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;