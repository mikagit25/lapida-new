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
  { path: '/mobile', label: 'Мобильная/PWA версия' },
];

const DemoFeaturesBlock = () => (
  <div className="bg-blue-50 rounded-lg shadow p-6 mb-6">
    <h2 className="text-lg font-semibold text-blue-900 mb-4">Демо новых функций</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {demoLinks.map(link => (
        <Link
          key={link.path}
          to={link.path}
          className="block bg-white hover:bg-blue-100 text-blue-700 px-4 py-2 rounded transition-colors font-medium border border-blue-100"
        >
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);

export default DemoFeaturesBlock;
