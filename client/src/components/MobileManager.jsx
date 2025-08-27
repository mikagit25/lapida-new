import React from 'react';
import MobileNav from './MobileNav';
import MobileLayout from './MobileLayout';

const MobileManager = () => (
  <MobileLayout>
    <MobileNav />
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Мобильная версия / PWA</h1>
      <p className="text-gray-700">Платформа поддерживает мобильную навигацию и PWA. Добавьте сайт на главный экран для быстрого доступа.</p>
    </div>
  </MobileLayout>
);

export default MobileManager;
