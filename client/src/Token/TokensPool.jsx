import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { addLiquidity, claimReward, removeLiquidity, getProvider, getReward, getAPR } from './poolWeb3';

// TODO: интеграция с контрактом пула через tokenWeb3.js
// Премия начисляется в MLPD за предоставленную ликвидность USDT/LPD

const TokensPool = () => {
  const { t } = useTranslation();
  const [usdtAmount, setUsdtAmount] = useState('');
  const [lpdAmount, setLpdAmount] = useState('');
  const [mlpdReward, setMlpdReward] = useState(0);
  const [poolInfo, setPoolInfo] = useState(null);
  const [apr, setApr] = useState(0);
    const [lockValue, setLockValue] = useState('');
    const [lockUnit, setLockUnit] = useState('hours'); // 'hours' or 'days'
    const minLockHours = 12;
    // Вычисляем lockPeriod в секундах для контракта
    const getLockPeriodSeconds = () => {
      let value = parseInt(lockValue);
      if (isNaN(value) || value < minLockHours && lockUnit === 'hours') return minLockHours * 3600;
      if (lockUnit === 'days') {
        if (value * 24 < minLockHours) return minLockHours * 3600;
        return value * 24 * 3600;
      }
      return value * 3600;
    };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { address, isConnected } = useAccount();

  // Получить APR из контракта
  const fetchAPR = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const aprValue = await getAPR(signer);
      setApr(Number(aprValue));
    } catch (e) {
      setApr(0);
    }
  };

  const handleAddLiquidity = async () => {
    setLoading(true);
    setError('');
    try {
      if (!isConnected) throw new Error('Сначала подключите кошелёк');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
        await addLiquidity(
          signer,
          ethers.parseUnits(usdtAmount, 18),
          ethers.parseUnits(lpdAmount, 18),
          getLockPeriodSeconds()
        );
      await fetchPoolInfo();
      await fetchReward();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleClaimReward = async () => {
    setLoading(true);
    setError('');
    try {
      if (!isConnected) throw new Error('Сначала подключите кошелёк');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      await claimReward(signer);
      await fetchPoolInfo();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleRemoveLiquidity = async () => {
    setLoading(true);
    setError('');
    try {
      if (!isConnected) throw new Error('Сначала подключите кошелёк');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      await removeLiquidity(signer);
      await fetchPoolInfo();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const fetchPoolInfo = async () => {
    if (!isConnected) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const info = await getProvider(signer, address);
      setPoolInfo({
        usdt: info[0] ? ethers.formatUnits(info[0], 18) : '0',
        lpd: info[1] ? ethers.formatUnits(info[1], 18) : '0',
        depositTime: info[2] ? Number(info[2]) : 0,
        lockPeriod: info[3] ? Number(info[3]) : 0,
        claimedReward: info[4] ? ethers.formatUnits(info[4], 18) : '0'
      });
    } catch (e) {
      setError(e.message);
    }
  };

  const fetchReward = async () => {
    if (!isConnected) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const reward = await getReward(signer, address);
      setMlpdReward(reward ? ethers.formatUnits(reward, 18) : '0');
    } catch (e) {
      setMlpdReward(0);
    }
  };

  useEffect(() => {
    fetchPoolInfo();
    fetchReward();
    fetchAPR();
    // eslint-disable-next-line
  }, [address, isConnected]);

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{t('tokens.pool.title', 'Пул ликвидности USDT/LPD')}</h2>
      <div className="mb-4">
        <label className="block mb-2">USDT:</label>
        <input type="number" value={usdtAmount} onChange={e => setUsdtAmount(e.target.value)} className="border px-3 py-2 rounded w-full" />
      </div>
      <div className="mb-4">
        <label className="block mb-2">LPD:</label>
        <input type="number" value={lpdAmount} onChange={e => setLpdAmount(e.target.value)} className="border px-3 py-2 rounded w-full" />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">{t('tokens.pool.lockLabel', 'Срок блокировки')}</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={lockUnit === 'hours' ? minLockHours : 1}
            className="border rounded px-2 py-1 w-32"
            value={lockValue}
            onChange={e => setLockValue(e.target.value)}
            placeholder={lockUnit === 'hours' ? t('tokens.pool.minHours', {min: minLockHours, defaultValue: `Минимум ${minLockHours}`}) : t('tokens.pool.min1', 'Минимум 1')}
          />
          <select
            className="border rounded px-2 py-1"
            value={lockUnit}
            onChange={e => setLockUnit(e.target.value)}
          >
            <option value="hours">{t('tokens.pool.hours', 'Часы')}</option>
            <option value="days">{t('tokens.pool.days', 'Дни')}</option>
          </select>
        </div>
        <div className="text-xs text-gray-500">{t('tokens.pool.minHint', 'Минимальный срок: 12 часов. Если не указано — будет выбран минимум.')}</div>
      </div>
      <div className="mb-4 text-blue-700 font-semibold">{t('tokens.pool.apr', 'Текущий APR')}: {apr ? apr + '%' : '—'}</div>
      <button onClick={handleAddLiquidity} disabled={loading || !isConnected} className="bg-blue-600 text-white px-4 py-2 rounded">
        {t('tokens.pool.add', 'Добавить ликвидность')}
      </button>
      <button onClick={handleClaimReward} disabled={loading || !isConnected} className="bg-green-600 text-white px-4 py-2 rounded ml-2">
        {t('tokens.pool.claim', 'Получить премию MLPD')}
      </button>
      <button onClick={handleRemoveLiquidity} disabled={loading || !isConnected} className="bg-red-600 text-white px-4 py-2 rounded ml-2">
        {t('tokens.pool.remove', 'Забрать ликвидность')}
      </button>
      {mlpdReward > 0 && (
        <div className="mt-4 text-green-600">{t('tokens.pool.rewardToClaim', 'Премия к получению')}: {mlpdReward} MLPD</div>
      )}
      {poolInfo && (
        <div className="mt-4 text-gray-700">
          <div>{t('tokens.pool.yourPool', 'Ваш пул')}: {poolInfo.usdt} USDT / {poolInfo.lpd} LPD</div>
          <div>{t('tokens.pool.lockPeriod', 'Срок блокировки')}: {poolInfo.lockPeriod ? (poolInfo.lockPeriod / 86400).toFixed(1) + ' ' + t('tokens.pool.days', 'дней') : '-'}</div>
          <div>{t('tokens.pool.lastDeposit', 'Последний депозит')}: {poolInfo.depositTime ? new Date(poolInfo.depositTime * 1000).toLocaleString() : '-'}</div>
          <div>{t('tokens.pool.claimed', 'Получено премий')}: {poolInfo.claimedReward} MLPD</div>
        </div>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
};

export default TokensPool;
