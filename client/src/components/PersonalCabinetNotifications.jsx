import React from 'react';
import { Link } from 'react-router-dom';

function PersonalCabinetNotifications({ notifications, formatDate }) {
  return (
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
  );
}

export default PersonalCabinetNotifications;
