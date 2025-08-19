import React from 'react';

const MemorialStats = ({ memorial, comments }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Просмотры</span>
          <span className="font-semibold">{memorial.views || 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Комментарии</span>
          <span className="font-semibold">{comments.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Создан</span>
          <span className="font-semibold">
            {new Date(memorial.createdAt).toLocaleDateString('ru-RU')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MemorialStats;
