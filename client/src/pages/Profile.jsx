import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, userService } from '../services/api';
import { fixImageUrl } from '../utils/imageUrl';

// Асинхронный компонент для фото профиля
function AsyncProfileImage({ url, alt, className }) {
  const [imgUrl, setImgUrl] = React.useState('');
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!url) {
        if (isMounted) setImgUrl('');
        return;
      }
      const fixed = await fixImageUrl(url);
      if (isMounted) setImgUrl(fixed);
    })();
    return () => { isMounted = false; };
  }, [url]);
  if (!imgUrl) return null;
  return <img src={imgUrl} alt={alt} className={className} />;
}
import ImageUpload from '../components/ImageUpload';
import Gallery from '../components/Gallery';
import UserSettings from '../components/UserSettings';
import UserMemorials from '../components/UserMemorials';
import UserActivity from '../components/UserActivity';
import PersonalDataManager from '../components/PersonalDataManager';
import ActivityHistory from '../components/ActivityHistory';
import PreferencesManager from '../components/PreferencesManager';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    memorialsCreated: 0,
    flowersLeft: 0,
    commentsLeft: 0
  });

  useEffect(() => {
    if (user) {
      // Загружаем статистику
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const statsData = await userService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок профиля */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4">
            <div className="flex items-center space-x-4">
              {user.photo && (
                <AsyncProfileImage
                  url={user.photo}
                  alt="Фото профиля"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name || 'Пользователь'}</h1>
                <p className="text-gray-600">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Администратор
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Система табов */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', name: 'Обзор', icon: '👤' },
                { id: 'personal', name: 'Личные данные', icon: '📝' },
                { id: 'activity', name: 'История активности', icon: '📊' },
                { id: 'preferences', name: 'Предпочтения', icon: '🎛️' },
                { id: 'memorials', name: 'Мои мемориалы', icon: '🏛️' },
                { id: 'my-activity', name: 'Мои комментарии', icon: '💬' },
                { id: 'settings', name: 'Настройки', icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-700">{success}</p>
              </div>
            )}

            {/* Контент табов */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Информация о профиле</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Имя</h3>
                          <p className="mt-1 text-lg text-gray-900">{user.name || 'Не указано'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</h3>
                          <p className="mt-1 text-lg text-gray-900">{user.email || 'Не указано'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Телефон</h3>
                          <p className="mt-1 text-lg text-gray-900">{user.phone || 'Не указано'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Дата регистрации</h3>
                          <p className="mt-1 text-lg text-gray-900">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : 'Не указано'}
                          </p>
                        </div>
                      </div>
                      {user.bio && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">О себе</h3>
                          <p className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{user.bio}</p>
                        </div>
                      )}
                    </div>
                    {/* Галерея пользователя (теперь Gallery.jsx, как в мемориалах) */}
                    <Gallery
                      images={user.gallery}
                      canEdit={true}
                      currentProfileImage={user.photo}
                      userMode={true}
                      onImagesUpdate={imgs => { user.gallery = imgs; }}
                      onProfileImageChange={() => window.location.reload()}
                    />
                  </div>
                  <div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h2>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{stats.memorialsCreated || 0}</div>
                          <div className="text-sm text-gray-600">Созданных мемориалов</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{stats.flowersLeft || 0}</div>
                          <div className="text-sm text-gray-600">Оставленных цветов</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{stats.commentsLeft || 0}</div>
                          <div className="text-sm text-gray-600">Комментариев</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'personal' && <PersonalDataManager />}
            {activeTab === 'activity' && <ActivityHistory />}
            {activeTab === 'preferences' && <PreferencesManager />}
            {activeTab === 'memorials' && <UserMemorials />}
            {activeTab === 'my-activity' && <UserActivity />}
            {activeTab === 'settings' && <UserSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
