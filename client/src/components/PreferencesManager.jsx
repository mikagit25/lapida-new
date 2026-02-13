import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PreferencesManager = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [preferences, setPreferences] = useState({
    // Уведомления
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Приватность
    profileVisibility: 'public', // public, friends, private
    showEmail: false,
    showPhone: false,
    allowMessagesFromStrangers: true,
    
    // Интерфейс
    theme: 'light', // light, dark, auto
    language: 'ru', // ru, en, uk
    timezone: 'Europe/Moscow',
    dateFormat: 'DD.MM.YYYY',
    
    // Мемориалы
    defaultMemorialPrivacy: 'public',
    autoApproveComments: false,
    moderateComments: true,
    allowPhotoComments: true,
    
    // Контент
    contentLanguageFilter: false,
    hideOffensiveContent: true,
    autoTranslate: false,
    
    // Интеграции
    socialMediaSharing: true,
    googleMapsIntegration: true,
    calendarIntegration: false
  });

  useEffect(() => {
    if (user) {
      loadPreferences();
    }
  }, [user]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const response = await userService.getPreferences();
      if (response.preferences) {
        setPreferences(prev => ({ ...prev, ...response.preferences }));
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
      setError('Ошибка загрузки настроек');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
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
      await userService.updatePreferences(preferences);
      setSuccess('Настройки успешно сохранены');
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Ошибка при сохранении настроек');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('Сбросить все настройки к значениям по умолчанию?')) {
      setPreferences({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        profileVisibility: 'public',
        showEmail: false,
        showPhone: false,
        allowMessagesFromStrangers: true,
        theme: 'light',
        language: 'ru',
        timezone: 'Europe/Moscow',
        dateFormat: 'DD.MM.YYYY',
        defaultMemorialPrivacy: 'public',
        autoApproveComments: false,
        moderateComments: true,
        allowPhotoComments: true,
        contentLanguageFilter: false,
        hideOffensiveContent: true,
        autoTranslate: false,
        socialMediaSharing: true,
        googleMapsIntegration: true,
        calendarIntegration: false
      });
    }
  };

  if (!user) {
    return <div className="bg-white shadow rounded-lg p-6">Войдите, чтобы управлять настройками.</div>;
  }

  if (loading && !preferences.emailNotifications) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Настройки предпочтений</h2>
        </div>
        <div className="px-6 py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Загрузка настроек...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Настройки предпочтений</h2>
            <p className="text-sm text-gray-600">Персонализируйте свой опыт использования</p>
          </div>
          <button
            onClick={resetToDefaults}
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Сбросить к умолчанию
          </button>
        </div>
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Уведомления */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">🔔 Уведомления</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Email уведомления о новых комментариях и активности
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.pushNotifications}
                  onChange={(e) => handlePreferenceChange('pushNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Push уведомления в браузере
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.smsNotifications}
                  onChange={(e) => handlePreferenceChange('smsNotifications', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  SMS уведомления (только важные)
                </span>
              </label>
            </div>
          </div>

          {/* Приватность */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">🔒 Приватность</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Видимость профиля
                </label>
                <select
                  value={preferences.profileVisibility}
                  onChange={(e) => handlePreferenceChange('profileVisibility', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="public">Публичный - виден всем</option>
                  <option value="friends">Друзья - только зарегистрированным пользователям</option>
                  <option value="private">Приватный - только мне</option>
                </select>
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.showEmail}
                  onChange={(e) => handlePreferenceChange('showEmail', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Показывать email в профиле
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.showPhone}
                  onChange={(e) => handlePreferenceChange('showPhone', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Показывать телефон в профиле
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.allowMessagesFromStrangers}
                  onChange={(e) => handlePreferenceChange('allowMessagesFromStrangers', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Разрешить сообщения от незнакомых пользователей
                </span>
              </label>
            </div>
          </div>

          {/* Интерфейс */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">🎨 Интерфейс</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тема оформления
                </label>
                <select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="light">Светлая</option>
                  <option value="dark">Темная</option>
                  <option value="auto">Автоматическая</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Язык интерфейса
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                  <option value="uk">Українська</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Часовой пояс
                </label>
                <select
                  value={preferences.timezone}
                  onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Europe/Moscow">Москва (UTC+3)</option>
                  <option value="Europe/Kiev">Киев (UTC+2)</option>
                  <option value="Europe/Minsk">Минск (UTC+3)</option>
                  <option value="Europe/London">Лондон (UTC+0)</option>
                  <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Формат даты
                </label>
                <select
                  value={preferences.dateFormat}
                  onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="DD.MM.YYYY">31.12.2023</option>
                  <option value="MM/DD/YYYY">12/31/2023</option>
                  <option value="YYYY-MM-DD">2023-12-31</option>
                  <option value="DD MMM YYYY">31 дек 2023</option>
                </select>
              </div>
            </div>
          </div>

          {/* Мемориалы */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">🏛️ Мемориалы</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Приватность новых мемориалов по умолчанию
                </label>
                <select
                  value={preferences.defaultMemorialPrivacy}
                  onChange={(e) => handlePreferenceChange('defaultMemorialPrivacy', e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="public">Публичный</option>
                  <option value="friends">Только для друзей</option>
                  <option value="private">Приватный</option>
                </select>
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.autoApproveComments}
                  onChange={(e) => handlePreferenceChange('autoApproveComments', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Автоматически одобрять комментарии
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.moderateComments}
                  onChange={(e) => handlePreferenceChange('moderateComments', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Включить модерацию комментариев
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.allowPhotoComments}
                  onChange={(e) => handlePreferenceChange('allowPhotoComments', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Разрешить комментарии к фотографиям
                </span>
              </label>
            </div>
          </div>

          {/* Контент */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">📝 Контент</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.contentLanguageFilter}
                  onChange={(e) => handlePreferenceChange('contentLanguageFilter', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Фильтровать контент по языку
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.hideOffensiveContent}
                  onChange={(e) => handlePreferenceChange('hideOffensiveContent', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Скрывать потенциально оскорбительный контент
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.autoTranslate}
                  onChange={(e) => handlePreferenceChange('autoTranslate', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Автоматически переводить текст
                </span>
              </label>
            </div>
          </div>

          {/* Интеграции */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">🔗 Интеграции</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.socialMediaSharing}
                  onChange={(e) => handlePreferenceChange('socialMediaSharing', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Разрешить публикацию в социальных сетях
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.googleMapsIntegration}
                  onChange={(e) => handlePreferenceChange('googleMapsIntegration', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Интеграция с Google Maps
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.calendarIntegration}
                  onChange={(e) => handlePreferenceChange('calendarIntegration', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Синхронизация с календарем
                </span>
              </label>
            </div>
          </div>

          {/* Кнопки */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetToDefaults}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Сбросить
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Сохранение...' : 'Сохранить настройки'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreferencesManager;