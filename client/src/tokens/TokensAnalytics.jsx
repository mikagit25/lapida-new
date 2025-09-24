import React, { useEffect, useState } from 'react';

const TokensAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setLoading(false);
      });
  }, []);
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">Аналитика токенов</h2>
      {loading ? <p>Загрузка...</p> : stats ? (
        <div className="bg-gray-100 p-4 rounded-lg">
          <div>Операций ликвидности: <b>{stats.liquidityCount}</b></div>
          <div>Операций обмена: <b>{stats.exchangeCount}</b></div>
          <div>Операций стейкинга: <b>{stats.stakingCount}</b></div>
          <div className="mt-4 text-xs text-gray-600">Последние операции отображаются в API /api/analytics</div>
        </div>
      ) : <p>Нет данных</p>}
    </div>
  );
};

export default TokensAnalytics;
