import React, { useState, useEffect } from 'react';
import { addLiquidity, removeLiquidity } from '../web3Liquidity';
import LiquidityHistory from './LiquidityHistory';

function LiquidityPool() {
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [provider, setProvider] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const ROUTER_ADDRESS = '0x...';
  const TOKEN_A = '0x...';
  const TOKEN_B = '0x...';
  const [history, setHistory] = useState([]);
  // Получение истории операций пула
  useEffect(() => {
    async function fetchHistory() {
      if (walletConnected && provider) {
        const wallet = await provider.getSigner().getAddress();
        const res = await fetch('http://localhost:4000/api/liquidity');
        const data = await res.json();
        setHistory(data.history.filter(h => h.wallet === wallet));
      }
    }
    fetchHistory();
  }, [walletConnected, provider, txStatus]);

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

  const handleAddLiquidity = async () => {
    setTxStatus('Добавление ликвидности...');
    try {
      if (!provider) throw new Error('Кошелек не подключен');
      const txHash = await addLiquidity(provider, ROUTER_ADDRESS, TOKEN_A, TOKEN_B, amountA, amountB);
      setTxStatus('Ликвидность успешно добавлена!');
      const wallet = await provider.getSigner().getAddress();
      await fetch('http://localhost:4000/api/liquidity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          amountA,
          amountB,
          action: 'add',
          txHash,
          timestamp: Date.now()
        })
      });
    } catch (e) {
      setTxStatus('Ошибка: ' + e.message);
    }
  };

  const handleRemoveLiquidity = async () => {
    setTxStatus('Удаление ликвидности...');
    try {
      if (!provider) throw new Error('Кошелек не подключен');
      const txHash = await removeLiquidity(provider, ROUTER_ADDRESS, TOKEN_A, TOKEN_B, amountA); // amountA как пример
      setTxStatus('Ликвидность успешно удалена!');
      const wallet = await provider.getSigner().getAddress();
      await fetch('http://localhost:4000/api/liquidity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          amountA,
          amountB,
          action: 'remove',
          txHash,
          timestamp: Date.now()
        })
      });
    } catch (e) {
      setTxStatus('Ошибка: ' + e.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow w-96 mt-8">
      <h2 className="text-lg font-semibold mb-4">Пул ликвидности</h2>
      <input type="number" placeholder="Сумма токена A" value={amountA} onChange={e => setAmountA(e.target.value)} className="mb-2 w-full p-2 border rounded" />
      <input type="number" placeholder="Сумма токена B" value={amountB} onChange={e => setAmountB(e.target.value)} className="mb-2 w-full p-2 border rounded" />
      <button className="w-full bg-blue-600 text-white py-2 rounded mb-2" onClick={handleConnect}>
        {walletConnected ? 'Кошелек подключен' : 'Подключить кошелек'}
      </button>
      <button className="w-full bg-green-600 text-white py-2 rounded mb-2" disabled={!walletConnected || !amountA || !amountB} onClick={handleAddLiquidity}>
        Добавить ликвидность
      </button>
      <button className="w-full bg-red-600 text-white py-2 rounded" disabled={!walletConnected} onClick={handleRemoveLiquidity}>
        Удалить ликвидность
      </button>
      {txStatus && <div className="mt-2 text-sm text-gray-700">{txStatus}</div>}
      <LiquidityHistory history={history} />
    </div>
  );
}

export default LiquidityPool;
