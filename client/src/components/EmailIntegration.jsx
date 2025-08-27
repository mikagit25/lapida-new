import React from 'react';

const EmailIntegration = ({ status }) => (
  <div className="bg-white rounded-lg shadow p-4 mb-4">
    <h2 className="text-lg font-semibold mb-2">Email интеграция</h2>
    <div className="text-gray-700">Статус: {status ? status : 'не подключено'}</div>
    {/* Кнопки управления, настройки и тестирования */}
  </div>
);

export default EmailIntegration;
