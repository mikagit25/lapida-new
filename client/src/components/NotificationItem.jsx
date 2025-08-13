import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const {
    id,
    type,
    title,
    message,
    isRead,
    createdAt,
    relatedUser,
    relatedMemorial,
    actionUrl
  } = notification;

  // Иконки для разных типов уведомлений
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'comment':
        return (
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.013 9.013 0 01-5.314-1.755L3 20l1.755-3.686A8.958 8.958 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'flower':
        return (
          <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        );
      case 'memorial_approved':
        return (
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'friend_request':
        return (
          <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5V7a10 10 0 0120 0v10z" />
            </svg>
          </div>
        );
    }
  };

  const handleClick = () => {
    if (!isRead) {
      onMarkAsRead(id);
    }
    
    if (actionUrl) {
      window.location.href = actionUrl;
    }
  };

  const formatTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: ru 
      });
    } catch (error) {
      return 'недавно';
    }
  };

  return (
    <div 
      className={`p-4 border-b border-gray-200 transition-colors duration-200 hover:bg-gray-50 ${
        !isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
      } ${actionUrl ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      <div className="flex items-start space-x-3">
        {/* Иконка уведомления */}
        {getNotificationIcon(type)}
        
        {/* Контент уведомления */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-medium ${!isRead ? 'text-gray-900' : 'text-gray-700'}`}>
              {title}
            </h4>
            
            {/* Время */}
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatTime(createdAt)}
            </span>
          </div>
          
          <p className={`mt-1 text-sm ${!isRead ? 'text-gray-800' : 'text-gray-600'}`}>
            {message}
          </p>
          
          {/* Дополнительная информация */}
          {relatedUser && (
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-xs text-gray-500">От:</span>
              <span className="text-xs font-medium text-gray-700">{relatedUser.name}</span>
            </div>
          )}
          
          {relatedMemorial && (
            <div className="mt-1 flex items-center space-x-2">
              <span className="text-xs text-gray-500">Мемориал:</span>
              <span className="text-xs font-medium text-gray-700">{relatedMemorial.name}</span>
            </div>
          )}
        </div>
        
        {/* Кнопки действий */}
        <div className="flex items-center space-x-2">
          {!isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(id);
              }}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
              title="Отметить как прочитанное"
            >
              ✓
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            className="text-gray-400 hover:text-red-600 text-xs"
            title="Удалить уведомление"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
