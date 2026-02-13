import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
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
import { Link } from 'react-router-dom';
import PersonalDataManager from '../components/PersonalDataManager';
import ActivityHistory from '../components/ActivityHistory';
import PreferencesManager from '../components/PreferencesManager';
import GoToConnectionsButton from '../components/GoToConnectionsButton';
import DemoFeaturesBlock from '../components/DemoFeaturesBlock';

const Profile = () => {
  const { t } = useTranslation();

  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    memorialsCreated: 0,
    flowersLeft: 0,
    commentsLeft: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

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
          <p className="mt-4 text-gray-600">{t('profile_loading')}</p>
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
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gray-100">
                {user.avatar ? (
                  <AsyncProfileImage
                    url={user.avatar}
                    alt="Аватар"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-3xl">👤</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name || t('user')}</h1>
                <p className="text-gray-600">{user.email}</p>
                {user.role === 'admin' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {t('admin')}
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
                { id: 'overview', name: t('tab_overview'), icon: '👤' },
                { id: 'personal', name: t('tab_personal'), icon: '📝' },
                { id: 'activity', name: t('tab_activity'), icon: '📊' },
                { id: 'preferences', name: t('tab_preferences'), icon: '🎛️' },
                { id: 'memorials', name: t('tab_memorials'), icon: '🏛️' },
                { id: 'my-activity', name: t('tab_my_activity'), icon: '💬' },
                { id: 'settings', name: t('tab_settings'), icon: '⚙️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`$
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
            {/* Контент табов */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <DemoFeaturesBlock />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('profile_info')}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t('name')}</h3>
                          <p className="mt-1 text-lg text-gray-900">{user.name || t('not_specified')}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Email</h3>
                          <p className="mt-1 text-lg text-gray-900">{user.email || t('not_specified')}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t('phone')}</h3>
                          <p className="mt-1 text-lg text-gray-900">{user.phone || t('not_specified')}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t('registration_date')}</h3>
                          <p className="mt-1 text-lg text-gray-900">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : t('not_specified')}
                          </p>
                        </div>
                      </div>
                      {user.bio && (
                        <div className="mt-4">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{t('about_me')}</h3>
                          <p className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{user.bio}</p>
                        </div>
                      )}
                    </div>
                    {/* Новый раздел галереи пользователя */}
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('user_gallery')}</h2>
                      <Gallery
                        images={user.gallery}
                        canEdit={true}
                        currentProfileImage={user.photo}
                        userMode={true}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('statistics')}</h2>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{stats.memorialsCreated || 0}</div>
                          <div className="text-sm text-gray-600">{t('memorials_created')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{stats.flowersLeft || 0}</div>
                          <div className="text-sm text-gray-600">{t('flowers_left')}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{stats.commentsLeft || 0}</div>
                          <div className="text-sm text-gray-600">{t('comments_left')}</div>
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
