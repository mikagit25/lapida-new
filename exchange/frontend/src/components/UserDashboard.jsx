import React, { useState, useEffect } from 'react';
import StakingHistory from './StakingHistory';
import LiquidityHistory from './LiquidityHistory';

function UserDashboard({ provider }) {
  const [wallet, setWallet] = useState('');
  const [balances, setBalances] = useState({ LPD: 0, USDT: 0, MLPD: 0 });
  const [stakingHistory, setStakingHistory] = useState([]);
  const [liquidityHistory, setLiquidityHistory] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (provider) {
        const w = await provider.getSigner().getAddress();
        setWallet(w);
        // Балансы (заглушка для MVP)
        setBalances({ LPD: 1000, USDT: 500, MLPD: 50 });
        // История стейкинга
        const resStaking = await fetch('http://localhost:4000/api/staking');
        const dataStaking = await resStaking.json();
        setStakingHistory(dataStaking.history.filter(h => h.wallet === w));
        // История пула
        const resLiquidity = await fetch('http://localhost:4000/api/liquidity');
        const dataLiquidity = await resLiquidity.json();
        setLiquidityHistory(dataLiquidity.history.filter(h => h.wallet === w));
      }
    }
    fetchData();
  }, [provider]);

  return (
    <div className="bg-white p-6 rounded shadow w-96 mt-8">
      <h2 className="text-lg font-semibold mb-4">Дашборд пользователя</h2>
      <div className="mb-4">
        <div><b>Кошелек:</b> {wallet}</div>
        <div><b>LPD:</b> {balances.LPD}</div>
        <div><b>USDT:</b> {balances.USDT}</div>
        <div><b>MLPD:</b> {balances.MLPD}</div>
      </div>
      <StakingHistory history={stakingHistory} />
      <LiquidityHistory history={liquidityHistory} />
    </div>
  );
}

export default UserDashboard;
