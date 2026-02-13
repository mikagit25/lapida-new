import React, { useState } from 'react';
import { ethers } from 'ethers';
import { mintToken } from './tokenWeb3';

const MintTokenForm = () => {
  const [provider, setProvider] = useState(null);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Listen for wallet connection from WalletConnectButton
  window.addEventListener('walletconnect', e => {
    setProvider(e.detail.provider);
    setAddress(e.detail.address);
  });

  const handleMint = async e => {
    e.preventDefault();
    setError('');
    setTxHash('');
    setLoading(true);
    try {
      if (!provider || !address) throw new Error('Сначала подключите кошелёк');
      const signer = await provider.getSigner();
      const tx = await mintToken(signer, address, ethers.parseUnits(amount, 18));
      setTxHash(tx.hash);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <form className="bg-white rounded-lg shadow p-6 flex flex-col items-center mb-8" onSubmit={handleMint}>
      <h3 className="text-lg font-bold mb-2">Минт токена (Web3)</h3>
      <input
        type="number"
        min="0"
        step="any"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        placeholder="Сумма для минта"
        className="border px-3 py-2 rounded mb-2 w-full"
        required
      />
      <button
        type="submit"
        disabled={loading || !provider}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow w-full"
      >
        {loading ? 'Минтинг...' : 'Минт токенов'}
      </button>
      {txHash && <div className="text-green-600 mt-2">Tx: <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash}</a></div>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default MintTokenForm;
