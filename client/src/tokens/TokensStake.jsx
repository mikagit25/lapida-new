import React from 'react';

const TokensStake = () => (
  <div className="max-w-xl mx-auto py-12 px-4">
    <h2 className="text-2xl font-bold mb-4">Стейкинг токенов</h2>
    <p className="mb-6">Застейкайте Lapida Token и получайте MLPD/GLPD. Подключите кошелёк для взаимодействия со смарт-контрактом.</p>
    <div className="mt-8">
      <h3 className="font-semibold mb-2">API стейкинга:</h3>
      <code className="block bg-gray-100 p-2 rounded">POST /api/staking</code>
    </div>
    <div className="mt-8">
      <h3 className="font-semibold mb-2">Инструкция:</h3>
      <ol className="list-decimal ml-6 text-gray-700">
        <li>Подключите MetaMask или другой web3-кошелёк.</li>
        <li>Выберите сумму для стейкинга.</li>
        <li>Подтвердите транзакцию.</li>
      </ol>
    </div>
  </div>
);

export default TokensStake;
