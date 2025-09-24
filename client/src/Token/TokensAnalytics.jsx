
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';


const TokensAnalytics = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/token/analytics')
      .then(res => res.json())
      .then(data => {
        setStats(data.stats);
        setLoading(false);
      });
  }, []);
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">{t('tokens.analytics.title', 'Аналитика токенов')}</h2>
      {loading ? <p>{t('tokens.analytics.loading', 'Загрузка...')}</p> : stats ? (
        <div className="bg-gray-100 p-4 rounded-lg">
          <div>{t('tokens.analytics.liquidity', 'Операций ликвидности')}: <b>{stats.liquidityCount}</b></div>
          <div>{t('tokens.analytics.exchange', 'Операций обмена')}: <b>{stats.exchangeCount}</b></div>
          <div>{t('tokens.analytics.staking', 'Операций стейкинга')}: <b>{stats.stakingCount}</b></div>
          <div className="mt-4 text-xs text-gray-600">{t('tokens.analytics.apiHint', 'Последние операции отображаются в API /api/analytics')}</div>
        </div>
      ) : <p>{t('tokens.analytics.noData', 'Нет данных')}</p>}
    </div>
  );
};

export default TokensAnalytics;
