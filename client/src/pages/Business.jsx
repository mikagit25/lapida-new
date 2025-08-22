import React from 'react';
import { Link } from 'react-router-dom';

const Business = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Возможности для бизнеса</h1>
        {/* Описание проекта */}
        <div className="mb-6 text-gray-700 text-lg">
          <p>Lapida — современная платформа для мемориальных и ритуальных компаний. Здесь вы можете продвигать свои услуги, управлять заказами, получать отзывы и работать с клиентами онлайн.</p>
        </div>
        {/* Кнопка регистрации компании */}
        <div className="mb-8 flex justify-center">
          <Link to="/register-company" className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow hover:bg-blue-700 text-xl font-semibold">Создать компанию</Link>
        </div>
        {/* Преимущества */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Преимущества работы с Lapida:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-2xl">★</span>
              <div>
                <div className="font-semibold">Привлечение новых клиентов</div>
                <div className="text-gray-600 text-sm">Ваша компания видна тысячам пользователей, ищущих услуги онлайн.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-2xl">⚡</span>
              <div>
                <div className="font-semibold">Удобное управление бизнесом</div>
                <div className="text-gray-600 text-sm">Личный кабинет, товары, услуги, заказы, отзывы — всё в одном месте.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-2xl">🔒</span>
              <div>
                <div className="font-semibold">Прозрачность и доверие</div>
                <div className="text-gray-600 text-sm">Отзывы клиентов и открытая статистика повышают доверие к вашей компании.</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 text-2xl">🚀</span>
              <div>
                <div className="font-semibold">Бесплатное размещение</div>
                <div className="text-gray-600 text-sm">Создание и продвижение компании на платформе — бесплатно.</div>
              </div>
            </div>
          </div>
        </div>
        {/* Основной функционал */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Что вы получите:</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Профиль компании с контактами, описанием, фото, товарами и услугами</li>
            <li>Управление заказами и товарами</li>
            <li>Получение и обработка отзывов</li>
            <li>Галерея, документы, новости</li>
            <li>QR-код для быстрой передачи информации</li>
            <li>Личный кабинет для управления бизнесом</li>
            <li>Интеграция с CRM (по необходимости)</li>
          </ul>
        </div>
        {/* Алгоритм работы */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Как начать работу:</h2>
          <ol className="list-decimal pl-6 text-gray-700 space-y-1">
            <li>Зарегистрируйтесь на сайте</li>
            <li>Создайте профиль компании</li>
            <li>Добавьте товары, услуги, фото, контакты</li>
            <li>Получайте заказы и отзывы</li>
            <li>Управляйте бизнесом через личный кабинет</li>
            <li>Продвигайте компанию с помощью QR-кода и коротких ссылок</li>
          </ol>
        </div>
        {/* FAQ (по желанию) */}
        {/* ...existing code... */}
      </div>
    </div>
  );
};

export default Business;
