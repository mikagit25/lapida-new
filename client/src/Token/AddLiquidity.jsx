import React, { useState } from 'react';

export default function AddLiquidity() {
  const [amountLPD, setAmountLPD] = useState('');
  const [amountUSDT, setAmountUSDT] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    // TODO: Вызов web3 для добавления ликвидности
    alert(`Добавлено: ${amountLPD} LPD и ${amountUSDT} USDT`);
  };

  return (
    <form className="token-form" onSubmit={handleAdd}>
      <h3>Добавить ликвидность</h3>
      <input
        type="number"
        placeholder="LPD"
        value={amountLPD}
        onChange={e => setAmountLPD(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="USDT"
        value={amountUSDT}
        onChange={e => setAmountUSDT(e.target.value)}
        required
      />
      <button type="submit">Добавить</button>
    </form>
  );
}
