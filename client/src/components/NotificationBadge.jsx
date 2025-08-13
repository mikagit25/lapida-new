import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';

const NotificationBadge = ({ className = '' }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUnreadCount();
    
    // Обновляем счетчик каждые 30 секунд
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error('Ошибка получения счетчика уведомлений:', error);
      setUnreadCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление счетчика извне
  const updateCount = (newCount) => {
    setUnreadCount(newCount);
  };

  // Экспортируем функцию для обновления
  React.useImperativeHandle(React.forwardRef(), () => ({
    updateCount,
    fetchUnreadCount
  }));

  if (isLoading) {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <div className="w-4 h-4 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    );
  }

  if (unreadCount === 0) {
    return null;
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full min-w-[20px] h-5">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    </div>
  );
};

export default NotificationBadge;
