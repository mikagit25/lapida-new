import React, { useState } from 'react';

export default function RemoveLiquidity() {
  const [amount, setAmount] = useState('');

  const handleRemove = (e) => {
    e.preventDefault();
    // TODO: Вызов web3 для удаления ликвидности
    alert(`Удалено: ${amount} LP токенов пула`);
  };

  return (
    <form className="token-form" onSubmit={handleRemove}>
      <h3>Удалить ликвидность</h3>
      <input
        type="number"
        placeholder="LP токены"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <button type="submit">Удалить</button>
    </form>
  );
}
