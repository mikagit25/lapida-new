import React, { useState, useEffect } from 'react';
import { stakeTokens } from '../web3Staking';
import StakingHistory from './StakingHistory';
import { stakeTokens } from '../web3Staking';

function Staking() {
  const [amount, setAmount] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [provider, setProvider] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [history, setHistory] = useState([]);
  const STAKING_ADDRESS = '0x...';
  const APR = 10; // 10% APR для примера

  // Подключение кошелька (можно вынести в отдельный хук)
  const handleConnect = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const { ethers } = await import('ethers');
      setProvider(new ethers.BrowserProvider(window.ethereum));
      setWalletConnected(true);
      setTxStatus('Кошелек подключен');
    } else {
      setTxStatus('MetaMask не найден');
    }
  };

  // Получение истории стейкинга
  useEffect(() => {
    async function fetchHistory() {
      if (walletConnected && provider) {
        const wallet = await provider.getSigner().getAddress();
        const res = await fetch('http://localhost:4000/api/staking');
        const data = await res.json();
        setHistory(data.history.filter(h => h.wallet === wallet));
      }
    }
    fetchHistory();
  }, [walletConnected, provider, txStatus]);

  const handleStake = async () => {
    setTxStatus('Выполняется стейкинг...');
    try {
      if (!provider) throw new Error('Кошелек не подключен');
      const result = await stakeTokens(provider, STAKING_ADDRESS, amount);
      setTxStatus('Стейкинг успешно выполнен!');
      const wallet = await provider.getSigner().getAddress();
      await fetch('http://localhost:4000/api/staking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          amount,
          txHash: result.txHash,
          mlpd: result.mlpd,
          timestamp: Date.now()
        })
      });
    } catch (e) {
      setTxStatus('Ошибка: ' + e.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow w-96 mt-8">
      <h2 className="text-lg font-semibold mb-4">Стейкинг стейблкоинов/LPD</h2>
      <div className="mb-2">APR: <span className="font-bold">{APR}%</span></div>
      <input type="number" placeholder="Сумма" value={amount} onChange={e => setAmount(e.target.value)} className="mb-2 w-full p-2 border rounded" />
      <button className="w-full bg-blue-600 text-white py-2 rounded mb-2" onClick={handleConnect}>
        {walletConnected ? 'Кошелек подключен' : 'Подключить кошелек'}
      </button>
      <button className="w-full bg-purple-600 text-white py-2 rounded" disabled={!walletConnected || !amount} onClick={handleStake}>
        Стейкать
      </button>
      {txStatus && <div className="mt-2 text-sm text-gray-700">{txStatus}</div>}
      <StakingHistory history={history} />
    </div>
  );
}

export default Staking;
