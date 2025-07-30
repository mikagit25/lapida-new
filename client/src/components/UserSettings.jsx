import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserSettings = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    privacyLevel: 'public',
    theme: 'light',
    language: 'ru'
  });

  useEffect(() => {
    if (user && user.settings) {
      setSettings({
        emailNotifications: user.settings.emailNotifications ?? true,
        privacyLevel: user.settings.privacyLevel || 'public',
        theme: user.settings.theme || 'light',
        language: user.settings.language || 'ru'
      });
    }
  }, [user]);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await userService.updateSettings(settings);
      // Обновляем пользователя в контексте
      updateProfile(updatedUser);
      setSuccess('Настройки успешно сохранены');
    } catch (error) {
      console.error('Error updating settings:', error);
      setError(error.response?.data?.message || 'Ошибка при сохранении настроек');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Настройки</h2>
      </div>

      <div className="px-6 py-6">
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Уведомления */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Уведомления</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Получать уведомления на email о новых комментариях к моим мемориалам
                </span>
              </label>
            </div>
          </div>

          {/* Приватность */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Приватность</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Уровень приватности профиля
              </label>
              <select
                value={settings.privacyLevel}
                onChange={(e) => handleSettingChange('privacyLevel', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="public">Публичный - всем видны мои мемориалы и комментарии</option>
                <option value="friends">Друзья - только зарегистрированным пользователям</option>
                <option value="private">Приватный - только мне</option>
              </select>
            </div>
          </div>

          {/* Тема */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Внешний вид</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Тема оформления
              </label>
              <select
                value={settings.theme}
                onChange={(e) => handleSettingChange('theme', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Светлая</option>
                <option value="dark">Темная</option>
                <option value="auto">Автоматически (по системе)</option>
              </select>
            </div>
          </div>

          {/* Язык */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Язык</h3>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Язык интерфейса
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ru">Русский</option>
                <option value="en">English</option>
                <option value="be">Беларуская</option>
              </select>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
