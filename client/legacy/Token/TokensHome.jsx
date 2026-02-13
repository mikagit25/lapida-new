
import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnectButton from './WalletConnectButton';
import MintTokenForm from './MintTokenForm';
import { useTranslation } from 'react-i18next';


const TokensHome = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-4">{t('tokens.home.title', 'Lapida Token Platform')}</h1>
      <p className="mb-6">{t('tokens.home.welcome', 'Добро пожаловать на платформу управления токенами Lapida. Здесь вы можете купить, обменять, застейкать токены, ознакомиться с документацией и аналитикой.')}</p>
      <ul className="space-y-3 mb-8">
        <li><Link to="/tokens/buy" className="text-blue-600 hover:underline">{t('tokens.home.buy', 'Купить токен')}</Link></li>
        <li><Link to="/tokens/swap" className="text-blue-600 hover:underline">{t('tokens.home.swap', 'Обменять токены (DEX)')}</Link></li>
        <li><Link to="/tokens/stake" className="text-blue-600 hover:underline">{t('tokens.home.stake', 'Стейкинг')}</Link></li>
        <li><Link to="/tokens/analytics" className="text-blue-600 hover:underline">{t('tokens.home.analytics', 'Аналитика')}</Link></li>
        <li><Link to="/tokens/docs" className="text-blue-600 hover:underline">{t('tokens.home.docs', 'Документация и whitepaper')}</Link></li>
        <li><Link to="/tokens/listing" className="text-blue-600 hover:underline">{t('tokens.home.listing', 'Листинг токена')}</Link></li>
        <li><Link to="/tokens/pool" className="text-green-600 hover:underline">{t('tokens.home.pool_usdt_lpd', 'Пул ликвидности USDT/LPD')}</Link></li>
        <li><Link to="/tokens/pool-mlpd-lpd" className="text-green-600 hover:underline">{t('tokens.home.pool_mlpd_lpd', 'Пул ликвидности MLPD/LPD')}</Link></li>
      </ul>
      {/* Wallet connect UI */}
      <div className="mb-8">
        <WalletConnectButton />
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-8">
        <strong>{t('tokens.home.contract', 'Контракт')}:</strong> <span className="font-mono">ВАШ_АДРЕС_ТОКЕНА</span><br/>
        <strong>{t('tokens.home.network', 'Сеть')}:</strong> Binance Smart Chain (BSC)
      </div>
      {/* Mint token UI */}
      <MintTokenForm />
    </div>
  );
};

export default TokensHome;
