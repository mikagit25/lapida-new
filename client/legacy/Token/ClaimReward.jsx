import React from 'react';

export default function ClaimReward() {
  const handleClaim = (e) => {
    e.preventDefault();
    // TODO: Вызов web3 для получения премии
    alert('Премия успешно получена!');
  };

  return (
    <form className="token-form" onSubmit={handleClaim}>
      <h3>Получить премию</h3>
      <button type="submit">Получить</button>
    </form>
  );
}
