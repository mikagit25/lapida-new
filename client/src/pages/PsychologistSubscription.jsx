import React from 'react';
import { Link } from 'react-router-dom';

const PsychologistSubscription = () => (
  <div className="max-w-xl mx-auto py-10 px-4">
    <h1 className="text-2xl font-bold mb-4">Подписка на AI-психолога</h1>
    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
      <p className="mb-2">Бесплатная версия ограничена 10 сообщениями. Для снятия лимитов и поддержки проекта оформите подписку.</p>
      <ul className="list-disc pl-5 text-sm text-gray-700 mb-2">
        <li>Безлимитное общение с AI-психологом</li>
        <li>Сохранение истории сессий</li>
        <li>Приоритетная поддержка</li>
        <li>Будущие расширенные функции</li>
      </ul>
      <p className="text-gray-500 text-xs">* Оплата доступна после релиза. Сейчас функция работает в демо-режиме.</p>
    </div>
    <button className="bg-blue-600 text-white px-6 py-2 rounded font-semibold mb-4" disabled>Оформить подписку (скоро)</button>
    <div>
      <Link to="/psychologist" className="text-blue-600 underline">Вернуться в чат</Link>
    </div>
  </div>
);

export default PsychologistSubscription;
