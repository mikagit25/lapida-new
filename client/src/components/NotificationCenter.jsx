import React, { useState, useEffect, useRef } from 'react';
import { notificationService } from '../services/api';
import NotificationItem from './NotificationItem';
import NotificationBadge from './NotificationBadge';

const NotificationCenter = ({ className = '' }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const dropdownRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    fetchNotifications(true);
  }, [filter]);

  useEffect(() => {
    // Закрытие при клике вне компонента
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async (reset = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const currentPage = reset ? 1 : page;
      const params = {
        page: currentPage,
        limit: 10,
        filter: filter !== 'all' ? filter : undefined
      };

      const response = await notificationService.getAll(params);
      const newNotifications = response.notifications || [];

      if (reset) {
        setNotifications(newNotifications);
        setPage(2);
      } else {
        setNotifications(prev => [...prev, ...newNotifications]);
        setPage(prev => prev + 1);
      }

      setHasMore(newNotifications.length === 10);
    } catch (error) {
      console.error('Ошибка загрузки уведомлений:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );

      // Обновляем счетчик в badge
      if (badgeRef.current) {
        badgeRef.current.fetchUnreadCount();
      }
    } catch (error) {
      console.error('Ошибка отметки уведомления как прочитанного:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, isRead: true }))
      );

      // Обновляем счетчик в badge
      if (badgeRef.current) {
        badgeRef.current.updateCount(0);
      }
    } catch (error) {
      console.error('Ошибка отметки всех уведомлений как прочитанных:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );

      // Обновляем счетчик в badge
      if (badgeRef.current) {
        badgeRef.current.fetchUnreadCount();
      }
    } catch (error) {
      console.error('Ошибка удаления уведомления:', error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Удалить все уведомления?')) return;

    try {
      await notificationService.clearAll();
      setNotifications([]);
      
      // Обновляем счетчик в badge
      if (badgeRef.current) {
        badgeRef.current.updateCount(0);
      }
    } catch (error) {
      console.error('Ошибка очистки уведомлений:', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      fetchNotifications(true);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Кнопка уведомлений */}
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg transition-colors"
        title="Уведомления"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a10 10 0 0120 0v10z" />
        </svg>
        
        {/* Badge с количеством непрочитанных */}
        <NotificationBadge 
          ref={badgeRef}
          className="absolute -top-1 -right-1"
        />
      </button>

      {/* Выпадающее меню */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 flex flex-col">
          {/* Заголовок */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Уведомления</h3>
              
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Прочитать все
                  </button>
                )}
                
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                  title="Очистить все"
                >
                  Очистить
                </button>
              </div>
            </div>

            {/* Фильтры */}
            <div className="flex space-x-2 mt-3">
              {['all', 'unread', 'read'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    filter === filterType
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filterType === 'all' ? 'Все' : filterType === 'unread' ? 'Непрочитанные' : 'Прочитанные'}
                </button>
              ))}
            </div>
          </div>

          {/* Список уведомлений */}
          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a10 10 0 0220 0v10z" />
                </svg>
                <p className="text-sm">Уведомлений нет</p>
              </div>
            ) : (
              <>
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}

                {/* Кнопка "Загрузить еще" */}
                {hasMore && (
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={() => fetchNotifications(false)}
                      disabled={isLoading}
                      className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                    >
                      {isLoading ? 'Загрузка...' : 'Загрузить еще'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
