
import React from 'react';
import { useTranslation } from 'react-i18next';


const TokensListing = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">{t('tokens.listing.title', 'Листинг токена Lapida')}</h2>
      <p className="mb-6">{t('tokens.listing.desc', 'Токен Lapida доступен на Binance Smart Chain и ведущих DEX-платформах.')}</p>
      <ul className="space-y-3 mb-8">
        <li><a href="/Token/LapidaToken_BEP20_Listing_Instructions.md" target="_blank" className="text-blue-600 hover:underline">{t('tokens.listing.instruction', 'Инструкция по листингу')}</a></li>
        <li><a href="https://pancakeswap.finance/swap?outputCurrency=ВАШ_АДРЕС_ТОКЕНА" target="_blank" className="text-green-600 hover:underline">{t('tokens.listing.pancake', 'Обмен на PancakeSwap')}</a></li>
        <li><a href="https://bscscan.com/token/ВАШ_АДРЕС_ТОКЕНА" target="_blank" className="text-gray-600 hover:underline">{t('tokens.listing.bscscan', 'Контракт на BscScan')}</a></li>
        <li><a href="https://tofunft.com/collection/ВАШ_АДРЕС_ТОКЕНА" target="_blank" className="text-purple-600 hover:underline">{t('tokens.listing.tofunft', 'Коллекция на TofuNFT')}</a></li>
      </ul>
      <div className="bg-gray-100 p-4 rounded-lg">
        <strong>{t('tokens.listing.contract', 'Контракт')}:</strong> <span className="font-mono">ВАШ_АДРЕС_ТОКЕНА</span><br/>
        <strong>{t('tokens.listing.network', 'Сеть')}:</strong> Binance Smart Chain (BSC)
      </div>
    </div>
  );
};

export default TokensListing;
