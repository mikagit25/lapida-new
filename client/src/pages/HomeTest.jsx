import React from 'react';
import { useTranslation } from 'react-i18next';

const Logo = () => (
  <div className="flex items-center space-x-2">
    <img src={require('../assets/home/company1.jpg')} alt="Lapida" className="w-10 h-10 rounded-full object-cover" />
    <span className="text-2xl font-bold text-blue-700">Lapida</span>
  </div>
);

const products = [
  { id: 1, nameKey: 'home_product1_name', descKey: 'home_product1_desc', img: require('../assets/home/product1.jpg') },
  { id: 2, nameKey: 'home_product2_name', descKey: 'home_product2_desc', img: require('../assets/home/product2.jpg') },
  { id: 3, nameKey: 'home_product3_name', descKey: 'home_product3_desc', img: require('../assets/home/product3.jpg') },
  { id: 4, nameKey: 'home_product4_name', descKey: 'home_product4_desc', img: require('../assets/home/product4.jpg') },
];

const companies = [
  { id: 1, nameKey: 'home_company1_name', descKey: 'home_company1_desc', img: require('../assets/home/company1.jpg') },
  { id: 2, nameKey: 'home_company2_name', descKey: 'home_company2_desc', img: require('../assets/home/company2.jpg') },
  { id: 3, nameKey: 'home_company3_name', descKey: 'home_company3_desc', img: require('../assets/home/company3.jpg') },
];

const reviews = [
  { id: 1, nameKey: 'home_review1_name', textKey: 'home_review1_text' },
  { id: 2, nameKey: 'home_review2_name', textKey: 'home_review2_text' },
  { id: 3, nameKey: 'home_review3_name', textKey: 'home_review3_text' },
];

const HomeTest = () => {
  const { t } = useTranslation();
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Фоновое изображение */}
      <div className="absolute inset-0 -z-10">
        <img src={require('../assets/home/hero-bg.jpg')} alt="Фон" className="w-full h-full object-cover opacity-30" />
      </div>
      <header className="bg-white/80 shadow py-6 mb-8 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Logo />
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4">
        {/* Hero-блок */}
        <section className="flex flex-col md:flex-row items-center py-16 gap-8">
          <div className="flex-1">
            <h1 className="text-5xl font-extrabold mb-6 text-gray-900 drop-shadow">{t('home_hero_title')}</h1>
            <p className="text-xl text-gray-700 mb-8">{t('home_hero_desc')}</p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition">{t('home_hero_btn_products')}</button>
              <button className="bg-white border border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition">{t('home_hero_btn_companies')}</button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src={require('../assets/home/product1.jpg')} alt="Мемориалы" className="w-80 h-80 object-cover rounded-2xl shadow-lg border-4 border-white" />
          </div>
        </section>
        {/* Блок товаров */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('home_popular_products')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
                <img src={p.img} alt={p.name} className="w-28 h-28 mb-4 rounded-lg object-cover" />
                <div className="font-semibold mb-1 text-lg">{t(p.nameKey)}</div>
                <div className="text-gray-500 mb-3 text-center">{t(p.descKey)}</div>
                <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">{t('add_to_cart')}</button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="text-blue-600 hover:underline text-lg">{t('see_all_products')}</button>
          </div>
        </section>
        {/* Блок компаний */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">{t('home_partner_companies')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {companies.map(c => (
              <div key={c.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition">
                <img src={c.img} alt={c.name} className="w-20 h-20 mb-4 rounded-full object-cover border-2 border-blue-200" />
                <div className="font-semibold mb-1 text-lg">{t(c.nameKey)}</div>
                <div className="text-gray-500 mb-3 text-center">{t(c.descKey)}</div>
                <button className="bg-blue-50 text-blue-700 px-5 py-2 rounded hover:bg-blue-100">Подробнее</button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="text-blue-600 hover:underline text-lg">Все компании</button>
          </div>
        </section>
        {/* Блок преимуществ */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Почему выбирают нас?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
              <span className="text-4xl mb-3">🔒</span>
              <div className="font-semibold mb-2 text-lg">Безопасность</div>
              <div className="text-gray-500 text-center">Данные и платежи под защитой</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
              <span className="text-4xl mb-3">⚡</span>
              <div className="font-semibold mb-2 text-lg">Удобство</div>
              <div className="text-gray-500 text-center">Быстрый поиск и заказ</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
              <span className="text-4xl mb-3">💬</span>
              <div className="font-semibold mb-2 text-lg">Поддержка</div>
              <div className="text-gray-500 text-center">Всегда на связи</div>
            </div>
          </div>
        </section>
        {/* Блок отзывов */}
        <section className="py-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Отзывы клиентов</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map(r => (
              <div key={r.id} className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
                <span className="text-2xl font-bold text-blue-600 mb-2">{r.name}</span>
                <div className="text-gray-700 text-center">{r.text}</div>
              </div>
            ))}
          </div>
        </section>
        {/* SEO-блок */}
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-6">О проекте Lapida</h2>
          <p className="text-gray-700 mb-2 text-lg">Lapida — современная платформа для поиска, заказа и управления товарами и услугами для мемориалов и компаний. Мы объединяем лучших поставщиков и предлагаем удобные инструменты для клиентов и бизнеса.</p>
          <p className="text-gray-700 text-lg">Наши преимущества: широкий выбор, честные цены, поддержка 24/7, удобный интерфейс и быстрая доставка.</p>
        </section>
        {/* Call to action */}
        <section className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Присоединяйтесь к Lapida!</h2>
          <p className="text-lg text-gray-700 mb-6">Зарегистрируйте свою компанию или найдите нужный товар прямо сейчас.</p>
          <button className="bg-blue-600 text-white px-10 py-4 rounded-lg font-semibold text-xl shadow hover:bg-blue-700 transition">Начать</button>
        </section>
      </main>
      <footer className="bg-white/80 py-8 mt-12 border-t border-gray-200 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Lapida. Все права защищены.
      </footer>
    </div>

