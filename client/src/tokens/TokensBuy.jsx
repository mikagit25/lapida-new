import React from 'react';

const TokensBuy = () => (
  <div className="max-w-xl mx-auto py-12 px-4">
    <h2 className="text-2xl font-bold mb-4">Купить токен Lapida</h2>
    <p className="mb-6">Для покупки токена Lapida используйте PancakeSwap или подключите кошелёк (MetaMask, TrustWallet).</p>
    <a href="https://pancakeswap.finance/swap?outputCurrency=ВАШ_АДРЕС_ТОКЕНА" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Купить на PancakeSwap</a>
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Инструкция:</h3>
      <ol className="list-decimal ml-6 text-gray-700">
        <li>Откройте PancakeSwap и подключите кошелёк.</li>
        <li>Вставьте адрес токена Lapida.</li>
        <li>Выберите сумму и подтвердите обмен.</li>
      </ol>
    </div>
  </div>
);

export default TokensBuy;
