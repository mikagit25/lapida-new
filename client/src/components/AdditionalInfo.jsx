import React from 'react';

const AdditionalInfo = ({ memorial, canEdit = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Дополнительная информация
      </h3>
      <div className="space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-600">Профессия:</span>
          <p className="text-gray-900">{memorial?.profession || 'Не указано'}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Хобби:</span>
          <p className="text-gray-900">{memorial?.hobbies || 'Не указано'}</p>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-600">Достижения:</span>
          <p className="text-gray-900">{memorial?.achievements || 'Не указано'}</p>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
