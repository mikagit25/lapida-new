import React from 'react';

// Временный логотип
const Logo = () => (
  <div className="flex items-center space-x-2">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#2563eb" />
      <text x="16" y="21" textAnchor="middle" fontSize="16" fill="#fff" fontFamily="Arial">L</text>
    </svg>
    <span className="text-2xl font-bold text-blue-700">Lapida</span>
  </div>
);

const HomeTest = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow py-6 mb-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Logo />
          {/* Верхнее меню не трогаем, оно в App.jsx */}
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4">
        {/* Hero-блок */}
        <section className="flex flex-col md:flex-row items-center py-12 gap-8">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Всё для мемориалов и компаний</h1>
            <p className="text-lg text-gray-700 mb-6">Платформа для поиска, заказа и управления товарами и услугами для мемориалов, компаний и частных лиц.</p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">Посмотреть товары</button>
              <button className="bg-white border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">Компании</button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/public/vite.svg" alt="Мемориалы" className="w-64 h-64 object-contain" />
          </div>
        </section>
        {/* Блок товаров */}
        <section className="py-10">
          <h2 className="text-2xl font-bold mb-6">Популярные товары</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Пример карточек товара */}
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <img src="/public/vite.svg" alt="Товар" className="w-24 h-24 mb-3" />
                <div className="font-semibold mb-1">Товар {i}</div>
                <div className="text-gray-500 mb-2">Описание товара</div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">В корзину</button>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button className="text-blue-600 hover:underline">Смотреть все товары</button>
          </div>
        </section>
        {/* Блок компаний */}
        <section className="py-10">
          <h2 className="text-2xl font-bold mb-6">Компании-партнёры</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-xl font-bold text-blue-700">C{i}</span>
                </div>
                <div className="font-semibold mb-1">Компания {i}</div>
                <div className="text-gray-500 mb-2">Описание компании</div>
                <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded hover:bg-blue-100">Подробнее</button>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button className="text-blue-600 hover:underline">Все компании</button>
          </div>
        </section>
        {/* Блок преимуществ */}
        <section className="py-10">
          <h2 className="text-2xl font-bold mb-6">Почему выбирают нас?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-3xl mb-2">🔒</span>
              <div className="font-semibold mb-1">Безопасность</div>
              <div className="text-gray-500">Данные и платежи под защитой</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-3xl mb-2">⚡</span>
              <div className="font-semibold mb-1">Удобство</div>
              <div className="text-gray-500">Быстрый поиск и заказ</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-3xl mb-2">💬</span>
              <div className="font-semibold mb-1">Поддержка</div>
              <div className="text-gray-500">Всегда на связи</div>
            </div>
          </div>
        </section>
        {/* SEO-блок */}
        <section className="py-10">
          <h2 className="text-xl font-bold mb-4">О проекте Lapida</h2>
          <p className="text-gray-700 mb-2">Lapida — современная платформа для поиска, заказа и управления товарами и услугами для мемориалов и компаний. Мы объединяем лучших поставщиков и предлагаем удобные инструменты для клиентов и бизнеса.</p>
          <p className="text-gray-700">Наши преимущества: широкий выбор, честные цены, поддержка 24/7, удобный интерфейс и быстрая доставка.</p>
        </section>
      </main>
    </div>
  );
};

export default HomeTest;
