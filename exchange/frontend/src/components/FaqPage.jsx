import React from 'react';

function FaqPage() {
  return (
    <div className="bg-white p-6 rounded shadow w-96 mt-8">
      <h2 className="text-lg font-semibold mb-4">FAQ</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Как купить LPD? — Через обменник на сайте.</li>
        <li>Как работает стейкинг? — Депозит стейблкоинов/LPD, начисление MLPD.</li>
        <li>Как добавить ликвидность? — Через пул ликвидности.</li>
        <li>Как участвовать в голосовании? — Через DAO-модуль.</li>
      </ul>
    </div>
  );
}

export default FaqPage;
