import React from 'react';

const TokensSwap = () => (
  <div className="max-w-xl mx-auto py-12 px-4">
    <h2 className="text-2xl font-bold mb-4">Обмен токенов (DEX)</h2>
    <p className="mb-6">Обменяйте Lapida Token на другие токены BSC через PancakeSwap или внутренний DEX.</p>
    <a href="https://pancakeswap.finance/swap?outputCurrency=ВАШ_АДРЕС_ТОКЕНА" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">Обменять на PancakeSwap</a>
    <div className="mt-8">
      <h3 className="font-semibold mb-2">API обмена:</h3>
      <code className="block bg-gray-100 p-2 rounded">POST /api/exchange</code>
    </div>
  </div>
);

export default TokensSwap;
