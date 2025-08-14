import React from 'react';
import { Link } from 'react-router-dom';

const Business = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Для бизнеса</h1>
        <p className="mb-4 text-gray-700">Зарегистрируйте свою компанию, чтобы добавить услуги, товары, документы и получать отзывы клиентов.</p>
        <Link to="/register-company" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 text-lg font-semibold">Зарегистрировать компанию</Link>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Возможности для компаний:</h2>
          <ul className="list-disc pl-6 text-gray-700">
            <li>Добавление информации о компании</li>
            <li>Загрузка галереи и документов</li>
            <li>Публикация товаров и услуг</li>
            <li>Получение и управление отзывами</li>
            <li>Личный кабинет для управления компанией</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Business;
