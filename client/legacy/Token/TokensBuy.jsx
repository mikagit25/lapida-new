
import React from 'react';
import { useTranslation } from 'react-i18next';


const TokensBuy = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">{t('tokens.buy.title', 'Купить токен Lapida')}</h2>
      <p className="mb-6">{t('tokens.buy.desc', 'Для покупки токена Lapida используйте PancakeSwap или подключите кошелёк (MetaMask, TrustWallet).')}</p>
      <a href="https://pancakeswap.finance/swap?outputCurrency=ВАШ_АДРЕС_ТОКЕНА" target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{t('tokens.buy.pancake', 'Купить на PancakeSwap')}</a>
      <form className="mt-8" onSubmit={async e => {
        e.preventDefault();
        const amount = e.target.amount.value;
        const res = await fetch('/api/token/buy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount })
        });
        const data = await res.json();
        alert(data.message || t('tokens.buy.requestSent', 'Запрос отправлен'));
      }}>
        <h3 className="font-semibold mb-2">{t('tokens.buy.apiTitle', 'Купить через API:')}</h3>
        <input name="amount" type="number" min="0" step="any" placeholder={t('tokens.buy.amount', 'Сумма')} className="border px-3 py-2 rounded mr-2" required />
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">{t('tokens.buy.buyBtn', 'Купить')}</button>
      </form>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">{t('tokens.buy.instruction', 'Инструкция:')}</h3>
        <ol className="list-decimal ml-6 text-gray-700">
          <li>{t('tokens.buy.step1', 'Откройте PancakeSwap и подключите кошелёк.')}</li>
          <li>{t('tokens.buy.step2', 'Вставьте адрес токена Lapida.')}</li>
          <li>{t('tokens.buy.step3', 'Выберите сумму и подтвердите обмен.')}</li>
        </ol>
      </div>
    </div>
  );
};

export default TokensBuy;
