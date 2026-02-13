import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { fixImageUrl } from '../utils/imageUrl';

const SecuritySettings = () => {
  useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('password');
  
  // Состояние для смены пароля
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Состояние для 2FA
  const [twoFactorAuth, setTwoFactorAuth] = useState({
    enabled: false,
    secret: '',
    qrCode: ''
  });

  // Состояние для сессий
  const [sessions, setSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  useEffect(() => {
    if (activeTab === 'sessions') {
      loadSessions();
    }
  }, [activeTab]);

  const loadSessions = async () => {
    try {
      setLoadingSessions(true);
      const response = await userService.getSessions();
      setSessions(response.data || []);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setError('Ошибка загрузки сессий');
    } finally {
      setLoadingSessions(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Новый пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await userService.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSuccess('Пароль успешно изменен');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setError(error.response?.data?.message || 'Ошибка при смене пароля');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!twoFactorAuth.enabled) {
        // Включаем 2FA - генерируем секрет
        const response = await userService.generate2FASecret();
        setTwoFactorAuth({
          enabled: false,
          secret: response.data.secret,
          qrCode: response.data.qrCode
        });
      } else {
        // Отключаем 2FA
        await userService.toggle2FA(false);
        setTwoFactorAuth({
          enabled: false,
          secret: '',
          qrCode: ''
        });
        setSuccess('Двухфакторная аутентификация отключена');
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      setError('Ошибка при изменении настроек 2FA');
    } finally {
      setLoading(false);
    }
  };

  const confirm2FA = async (code) => {
    setLoading(true);
    setError('');
    
    try {
      await userService.toggle2FA(true, twoFactorAuth.secret, code);
      setTwoFactorAuth(prev => ({ ...prev, enabled: true }));
      setSuccess('Двухфакторная аутентификация включена');
    } catch (error) {
      console.error('Error confirming 2FA:', error);
      setError('Неверный код подтверждения');
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId) => {
    try {
      await userService.terminateSession(sessionId);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      setSuccess('Сессия завершена');
    } catch (error) {
      console.error('Error terminating session:', error);
      setError('Ошибка при завершении сессии');
    }
  };

  const terminateAllSessions = async () => {
    try {
      await userService.terminateAllSessions();
      await loadSessions();
      setSuccess('Все сессии завершены');
    } catch (error) {
      console.error('Error terminating all sessions:', error);
      setError('Ошибка при завершении всех сессий');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const getDeviceIcon = (userAgent) => {
    if (userAgent.includes('Mobile')) {
      return '📱';
    } else if (userAgent.includes('Tablet')) {
      return '📱';
    } else {
      return '💻';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Безопасность</h2>
        <p className="text-sm text-gray-600">Управление безопасностью вашего аккаунта</p>
      </div>

      {/* Навигация по вкладкам */}
      <div className="px-6 py-4 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('password')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Смена пароля
          </button>
          <button
            onClick={() => setActiveTab('2fa')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === '2fa'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Двухфакторная аутентификация
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sessions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Активные сессии
          </button>
        </nav>
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

        {/* Вкладка смены пароля */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Текущий пароль
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Новый пароль
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                minLength="6"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Подтвердите новый пароль
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Изменение...' : 'Изменить пароль'}
            </button>
          </form>
        )}

        {/* Вкладка 2FA */}
        {activeTab === '2fa' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Двухфакторная аутентификация
                </h3>
                <p className="text-sm text-gray-600">
                  Дополнительный уровень защиты для вашего аккаунта
                </p>
              </div>
              <button
                onClick={handleToggle2FA}
                disabled={loading}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  twoFactorAuth.enabled
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? 'Обработка...' : twoFactorAuth.enabled ? 'Отключить' : 'Включить'}
              </button>
            </div>

            {twoFactorAuth.secret && !twoFactorAuth.enabled && (
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  Настройка двухфакторной аутентификации
                </h4>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      1. Установите приложение Google Authenticator или аналогичное
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      2. Отсканируйте QR-код или введите секретный ключ вручную
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      3. Введите код из приложения для подтверждения
                    </p>
                  </div>

                  {twoFactorAuth.qrCode && (
                    <div className="text-center">
                      <img 
                        src={fixImageUrl(twoFactorAuth.qrCode)} 
                        alt="QR Code for 2FA" 
                        className="mx-auto border border-gray-300 rounded"
                      />
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Секретный ключ:
                    </p>
                    <p className="text-sm font-mono bg-gray-100 p-2 rounded break-all">
                      {twoFactorAuth.secret}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Код подтверждения
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Введите 6-значный код"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        maxLength="6"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && e.target.value.length === 6) {
                            confirm2FA(e.target.value);
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const code = e.target.previousElementSibling.value;
                          if (code.length === 6) {
                            confirm2FA(code);
                          }
                        }}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Подтвердить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Вкладка активных сессий */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Активные сессии
              </h3>
              <button
                onClick={terminateAllSessions}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Завершить все сессии
              </button>
            </div>

            {loadingSessions ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Загрузка сессий...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Нет активных сессий</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">
                        {getDeviceIcon(session.userAgent)}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">
                          {session.browser} на {session.os}
                        </p>
                        <p className="text-sm text-gray-600">
                          IP: {session.ip}
                        </p>
                        <p className="text-sm text-gray-600">
                          Последняя активность: {formatDate(session.lastActivity)}
                        </p>
                        {session.current && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Текущая сессия
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {!session.current && (
                      <button
                        onClick={() => terminateSession(session.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Завершить
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecuritySettings;