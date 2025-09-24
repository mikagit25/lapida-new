
import React, { useState, useEffect } from 'react';
import { connectWallet, swapStableToLPD } from '../web3';
  const [history, setHistory] = useState([]);
  // Получение истории обменов при подключении кошелька
  useEffect(() => {
    if (walletConnected && provider) {
      (async () => {
        const wallet = await provider.getSigner().getAddress();
        const res = await fetch('http://localhost:4000/api/exchange');
        const data = await res.json();
        setHistory(data.history.filter(h => h.wallet === wallet));
      })();
    }
  }, [walletConnected, provider, txStatus]);

const STABLECOINS = [
  { symbol: 'USDT', address: '0x...' },
  { symbol: 'USDC', address: '0x...' },
  { symbol: 'DAI', address: '0x...' }
];
const LPD_ADDRESS = '0x...';

function Exchange() {
  const [selected, setSelected] = useState(STABLECOINS[0].symbol);
  const [amount, setAmount] = useState('');
  const [walletConnected, setWalletConnected] = useState(false);
  const [provider, setProvider] = useState(null);
  const [txStatus, setTxStatus] = useState('');

  const handleConnect = async () => {
    try {
      const prov = await connectWallet();
      setProvider(prov);
      setWalletConnected(true);
      setTxStatus('Кошелек подключен');
    } catch (e) {
      setTxStatus(e.message);
    }
  };

  const handleSwap = async () => {
    setTxStatus('Выполняется обмен...');
    try {
      const stable = STABLECOINS.find(c => c.symbol === selected);
      const txHash = await swapStableToLPD(provider, stable.address, LPD_ADDRESS, amount);
      setTxStatus('Обмен успешно выполнен!');
      // Запись истории обмена на backend
      const wallet = provider ? await provider.getSigner().getAddress() : '';
      await fetch('http://localhost:4000/api/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet,
          stablecoin: stable.symbol,
          amount,
          txHash,
          timestamp: Date.now()
        })
      });
    } catch (e) {
      setTxStatus('Ошибка: ' + e.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow w-96">
      <h2 className="text-lg font-semibold mb-4">Обмен стейблкоинов на LPD</h2>
      <select value={selected} onChange={e => setSelected(e.target.value)} className="mb-2 w-full p-2 border rounded">
        {STABLECOINS.map(c => <option key={c.symbol} value={c.symbol}>{c.symbol}</option>)}
      </select>
      <input type="number" placeholder="Сумма" value={amount} onChange={e => setAmount(e.target.value)} className="mb-2 w-full p-2 border rounded" />
      <button className="w-full bg-blue-600 text-white py-2 rounded mb-2" onClick={handleConnect}>
        {walletConnected ? 'Кошелек подключен' : 'Подключить кошелек'}
      </button>
      <button className="w-full bg-green-600 text-white py-2 rounded" disabled={!walletConnected || !amount} onClick={handleSwap}>
        Обменять на LPD
      </button>
      {txStatus && <div className="mt-2 text-sm text-gray-700">{txStatus}</div>}
      {/* История обменов */}
      {walletConnected && history.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">История обменов</h3>
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Дата</th>
                <th className="p-2 border">Монета</th>
                <th className="p-2 border">Сумма</th>
                <th className="p-2 border">TxHash</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td className="p-2 border">{new Date(h.timestamp).toLocaleString()}</td>
                  <td className="p-2 border">{h.stablecoin}</td>
                  <td className="p-2 border">{h.amount}</td>
                  <td className="p-2 border"><a href={`https://etherscan.io/tx/${h.txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{h.txHash.slice(0, 10)}...</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Exchange;
