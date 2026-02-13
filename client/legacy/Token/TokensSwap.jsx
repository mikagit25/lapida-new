
import React from 'react';
import { useTranslation } from 'react-i18next';


const TokensSwap = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">{t('tokens.swap.title', 'Обмен токенов (DEX)')}</h2>
      <p className="mb-6">{t('tokens.swap.desc', 'Обменяйте Lapida Token на другие токены BSC через PancakeSwap или внутренний DEX.')}</p>
      <a href="https://pancakeswap.finance/swap?outputCurrency=ВАШ_АДРЕС_ТОКЕНА" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">{t('tokens.swap.pancake', 'Обменять на PancakeSwap')}</a>
      <form className="mt-8" onSubmit={async e => {
        e.preventDefault();
        const from = e.target.from.value;
        const to = e.target.to.value;
        const amount = e.target.amount.value;
        const res = await fetch('/api/token/swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from, to, amount })
        });
        const data = await res.json();
        alert(data.message || t('tokens.swap.requestSent', 'Запрос отправлен'));
      }}>
        <h3 className="font-semibold mb-2">{t('tokens.swap.apiTitle', 'Обмен через API:')}</h3>
        <input name="from" type="text" placeholder={t('tokens.swap.from', 'Из токена')} className="border px-3 py-2 rounded mr-2" required />
        <input name="to" type="text" placeholder={t('tokens.swap.to', 'В токен')} className="border px-3 py-2 rounded mr-2" required />
        <input name="amount" type="number" min="0" step="any" placeholder={t('tokens.swap.amount', 'Сумма')} className="border px-3 py-2 rounded mr-2" required />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{t('tokens.swap.swapBtn', 'Обменять')}</button>
      </form>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">{t('tokens.swap.api', 'API обмена:')}</h3>
        <code className="block bg-gray-100 p-2 rounded">POST /api/token/swap</code>
      </div>
    </div>
  );
};

export default TokensSwap;
