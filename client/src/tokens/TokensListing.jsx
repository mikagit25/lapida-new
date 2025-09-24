import React from 'react';

const TokensListing = () => (
  <div className="max-w-xl mx-auto py-12 px-4">
    <h2 className="text-2xl font-bold mb-4">Листинг токена Lapida</h2>
    <p className="mb-6">Токен Lapida доступен на Binance Smart Chain и ведущих DEX-платформах.</p>
    <ul className="space-y-3 mb-8">
      <li><a href="/Токен/LapidaToken_BEP20_Listing_Instructions.md" target="_blank" className="text-blue-600 hover:underline">Инструкция по листингу</a></li>
      <li><a href="https://pancakeswap.finance/swap?outputCurrency=ВАШ_АДРЕС_ТОКЕНА" target="_blank" className="text-green-600 hover:underline">Обмен на PancakeSwap</a></li>
      <li><a href="https://bscscan.com/token/ВАШ_АДРЕС_ТОКЕНА" target="_blank" className="text-gray-600 hover:underline">Контракт на BscScan</a></li>
      <li><a href="https://tofunft.com/collection/ВАШ_АДРЕС_ТОКЕНА" target="_blank" className="text-purple-600 hover:underline">Коллекция на TofuNFT</a></li>
    </ul>
    <div className="bg-gray-100 p-4 rounded-lg">
      <strong>Контракт:</strong> <span className="font-mono">ВАШ_АДРЕС_ТОКЕНА</span><br/>
      <strong>Сеть:</strong> Binance Smart Chain (BSC)
    </div>
  </div>
);

export default TokensListing;
