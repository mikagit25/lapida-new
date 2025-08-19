import React from 'react';
import { Link } from 'react-router-dom';
import { getMemorialUrl } from '../utils/memorialUrl';

function PersonalCabinetMemorials({ recentMemorials, formatDate, fixImageUrl }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Мои мемориалы</h2>
        <Link
          to="/profile?tab=memorials"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Все мемориалы →
        </Link>
      </div>
      {recentMemorials.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">🏛️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Нет мемориалов</h3>
          <p className="text-gray-500 mb-4">Создайте первый мемориал для сохранения памяти</p>
          <Link
            to="/create-memorial"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Создать мемориал
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {recentMemorials.map((memorial) => (
            <div key={memorial._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
              {memorial.photo && (
                <img
                  src={fixImageUrl(memorial.photo)}
                  alt={`${memorial.firstName} ${memorial.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {memorial.firstName} {memorial.lastName}
                </h3>
                <p className="text-xs text-gray-500">
                  Создан {formatDate(memorial.createdAt)}
                </p>
                {memorial.views && (
                  <p className="text-xs text-gray-400">
                    {memorial.views} просмотр{memorial.views === 1 ? '' : memorial.views < 5 ? 'а' : 'ов'}
                  </p>
                )}
              </div>
              <Link
                to={getMemorialUrl(memorial)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Открыть
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonalCabinetMemorials;
