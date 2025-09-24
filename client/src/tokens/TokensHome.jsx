import React from 'react';
import { Link } from 'react-router-dom';

const TokensHome = () => (
  <div className="max-w-3xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-4">Lapida Token Platform</h1>
    <p className="mb-6">Добро пожаловать на платформу управления токенами Lapida. Здесь вы можете купить, обменять, застейкать токены, ознакомиться с документацией и аналитикой.</p>
    <ul className="space-y-3 mb-8">
      <li><Link to="/tokens/buy" className="text-blue-600 hover:underline">Купить токен</Link></li>
      <li><Link to="/tokens/swap" className="text-blue-600 hover:underline">Обменять токены (DEX)</Link></li>
      <li><Link to="/tokens/stake" className="text-blue-600 hover:underline">Стейкинг</Link></li>
      <li><Link to="/tokens/analytics" className="text-blue-600 hover:underline">Аналитика</Link></li>
      <li><Link to="/tokens/docs" className="text-blue-600 hover:underline">Документация и whitepaper</Link></li>
      <li><Link to="/tokens/listing" className="text-blue-600 hover:underline">Листинг токена</Link></li>
    </ul>
    <div className="bg-gray-100 p-4 rounded-lg">
      <strong>Контракт:</strong> <span className="font-mono">ВАШ_АДРЕС_ТОКЕНА</span><br/>
      <strong>Сеть:</strong> Binance Smart Chain (BSC)
    </div>
  </div>
);

export default TokensHome;
