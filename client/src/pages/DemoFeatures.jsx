import React from 'react';
import { Link } from 'react-router-dom';

const demoLinks = [
  { path: '/search', label: 'Поиск и фильтрация' },
  { path: '/genealogy', label: 'Генеалогия' },
  { path: '/timeline', label: 'Хронология' },
  { path: '/complaints', label: 'Жалобы и модерация' },
  { path: '/social', label: 'Социальные функции' },
  { path: '/payments', label: 'Платежи и донаты' },
  { path: '/admin', label: 'Админ-кабинет' },
  { path: '/integrations', label: 'Интеграции' },
  { path: '/mobile', label: 'Мобильная версия / PWA' },
];

const DemoFeatures = () => (
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <h2 className="text-xl font-semibold mb-4">Демо-страницы новых функций</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {demoLinks.map(link => (
        <Link
          key={link.path}
          to={link.path}
          className="block bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded transition-colors font-medium"
        >
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);

export default DemoFeatures;
