import React from 'react';
import AddLiquidity from './AddLiquidity';
import RemoveLiquidity from './RemoveLiquidity';
import ClaimReward from './ClaimReward';

// Главная страница пула ликвидности
export default function LiquidityPool() {
  return (
    <div className="token-section">
      <h2>Пул ликвидности Lapida</h2>
      <p>Добавляйте или убирайте ликвидность, получайте премии за участие в пуле.</p>
      <AddLiquidity />
      <RemoveLiquidity />
      <ClaimReward />
    </div>
  );
}
