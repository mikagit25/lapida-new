import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService, memorialService, newMemorialService, notificationService } from '../services/api';
import { getUserDisplayName } from '../utils/userUtils';
import PersonalCabinetStats from './PersonalCabinetStats';
import NotificationsList from './NotificationsList';
import PersonalCabinetMemorials from './PersonalCabinetMemorials';
import PersonalCabinetNotifications from './PersonalCabinetNotifications';
import PersonalCabinetActivity from './PersonalCabinetActivity';
import { fixImageUrl } from '../utils/imageUrl';
import GoToCompanyCabinetButton from './GoToCompanyCabinetButton';
import CompanyCabinetQuickActions from './CompanyCabinetQuickActions';
import { Link } from 'react-router-dom';
import GoToConnectionsButton from './GoToConnectionsButton';

const PersonalCabinet = () => {
  const [userCompanies, setUserCompanies] = useState([]);
  const { user, isAuthenticated } = useAuth();
  console.log('[PersonalCabinet] user:', user);
  console.log('[PersonalCabinet] user.companies:', user?.companies);
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
      fetchPersonalCabinetData();
      // Загружаем компании пользователя
      userService.getMe().then(res => {
        if (res && Array.isArray(res.companies)) {
          setUserCompanies(res.companies);
        } else {
          setUserCompanies([]);
        }
      }).catch(() => setUserCompanies([]));
    }
  }, [isAuthenticated, user]);

  const fetchPersonalCabinetData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Загружаем статистику
      const userStats = await userService.getStats().catch(err => {
        console.log('Stats error:', err);
        return { memorialsCreated: 0, flowersLeft: 0, commentsLeft: 0, totalViews: 0 };
      });

      // Загружаем мемориалы
      const memorialsData = await memorialService.getMyMemorials({ limit: 5 }).catch(err => {
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
      console.error('Error fetching personal cabinet data:', error);
      setError('Ошибка при загрузке данных личного кабинета');
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
          <p className="text-gray-600 mb-8">Войдите в систему, чтобы получить доступ к вашему личному кабинету</p>
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
      {/* Кнопка перехода в кабинет компании — отображается всегда, если есть компании */}
  <GoToCompanyCabinetButton companies={userCompanies} />
    </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка личного кабинета...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end mb-4">
          <GoToConnectionsButton />
        </div>
        {/* Заголовок личного кабинета */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Добро пожаловать, {getUserDisplayName(user)}!
          </h1>
          <p className="mt-2 text-gray-600">
            Обзор вашей активности на платформе Lapida
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchPersonalCabinetData}
              className="mt-2 text-red-600 hover:text-red-800 underline"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {/* Статистика */}
        <PersonalCabinetStats
          memorials={recentMemorials}
          comments={recentActivity}
          views={stats.totalViews}
        />

        {/* Основная сетка личного кабинета */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка - Быстрые действия и последние мемориалы */}
          <div className="lg:col-span-2 space-y-6">
            {/* Быстрые действия */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Быстрые действия</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link to="/my-orders" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-lg font-semibold inline-block mb-4">Мои заказы</Link>

                {/* Кнопка поговорить с психологом */}
                <Link
                  to="/psychologist"
                  className="flex items-center p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors bg-blue-50"
                  style={{ minHeight: 64 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-2xl">🧑‍⚕️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">Поговорить с психологом</h3>
                    <p className="text-xs text-gray-500">AI-чат или консультация с экспертом</p>
                  </div>
                </Link>
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
                    <p className="text-xs text-gray-500">Создайте новый мемориал</p>
                  </div>
                </Link>
                <div className="mt-4 flex flex-col gap-2">
                  <GoToCompanyCabinetButton companies={user && user.companies ? user.companies : []} />
                  <GoToConnectionsButton />
                  {user && user.companies && user.companies.length > 0 && (
                    <Link
                      to={`/company-cabinet/${user.companies[0]._id}`}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      <span style={{ fontSize: '1.2em', marginRight: '8px' }}>🏢</span>
                      Личный кабинет компании
                    </Link>
                  )}
                  {user && (
                    <Link
                      to={`/user/${user._id || user.id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <span style={{ fontSize: '1.2em', marginRight: '8px' }}>👤</span>
                      Моя публичная страница
                    </Link>
                  )}
                </div>

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

                {/* Кнопка перехода в кабинет компании */}
                {/* Быстрый переход в личные кабинеты всех компаний пользователя */}
                <GoToCompanyCabinetButton companies={user && user.companies ? user.companies : []} />
              </div>

            {/* Кнопка перехода в кабинет компании вне блока быстрых действий */}
            <GoToCompanyCabinetButton companies={user && user.companies ? user.companies : []} />
          </div>

            {/* Последние мемориалы */}
            <PersonalCabinetMemorials
              recentMemorials={recentMemorials}
              formatDate={formatDate}
              fixImageUrl={fixImageUrl}
            />
          </div>

          {/* Правая колонка - Уведомления и активность */}
          <div className="space-y-6">
            {/* Уведомления */}
            <NotificationsList />

            {/* Последняя активность */}
            <PersonalCabinetActivity
              recentActivity={recentActivity}
              formatDate={formatDate}
              getActivityIcon={getActivityIcon}
              getActivityText={getActivityText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalCabinet;