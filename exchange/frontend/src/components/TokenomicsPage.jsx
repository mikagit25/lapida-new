import React from 'react';

function TokenomicsPage() {
  return (
    <div className="bg-white p-6 rounded shadow w-96 mt-8">
      <h2 className="text-lg font-semibold mb-4">Токеномика</h2>
      <p>Структура распределения токенов, награды, механика сжигания и эмиссии. Подробнее см. PDF.</p>
      <a href="/docs/EN/LapidaToken_Tokenomics_EN.pdf" target="_blank" className="text-blue-600 underline">Скачать Tokenomics (PDF)</a>
    </div>
  );
}

export default TokenomicsPage;
