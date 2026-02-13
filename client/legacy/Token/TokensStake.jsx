
import React from 'react';
import { useTranslation } from 'react-i18next';


const TokensStake = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">{t('tokens.stake.title', 'Стейкинг токенов')}</h2>
      <p className="mb-6">{t('tokens.stake.desc', 'Застейкайте Lapida Token и получайте MLPD/GLPD. Подключите кошелёк для взаимодействия со смарт-контрактом.')}</p>
      <form className="mt-8" onSubmit={async e => {
        e.preventDefault();
        const amount = e.target.amount.value;
        const res = await fetch('/api/token/stake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount })
        });
        const data = await res.json();
        alert(data.message || t('tokens.stake.requestSent', 'Запрос отправлен'));
      }}>
        <h3 className="font-semibold mb-2">{t('tokens.stake.apiTitle', 'Стейкинг через API:')}</h3>
        <input name="amount" type="number" min="0" step="any" placeholder={t('tokens.stake.amount', 'Сумма')} className="border px-3 py-2 rounded mr-2" required />
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">{t('tokens.stake.stakeBtn', 'Стейкать')}</button>
      </form>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">{t('tokens.stake.api', 'API стейкинга:')}</h3>
        <code className="block bg-gray-100 p-2 rounded">POST /api/token/stake</code>
      </div>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">{t('tokens.stake.instruction', 'Инструкция:')}</h3>
        <ol className="list-decimal ml-6 text-gray-700">
          <li>{t('tokens.stake.step1', 'Подключите MetaMask или другой web3-кошелёк.')}</li>
          <li>{t('tokens.stake.step2', 'Выберите сумму для стейкинга.')}</li>
          <li>{t('tokens.stake.step3', 'Подтвердите транзакцию.')}</li>
        </ol>
      </div>
    </div>
  );
};

export default TokensStake;
