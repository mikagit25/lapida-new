import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
// TODO: заменить на реальный web3-файл для второго пула
import { addLiquidity, claimReward, removeLiquidity, getProvider, getReward, getAPR } from './poolWeb3MLPDLPD';

const TokensPoolMLPDLPD = () => {
  const { t } = useTranslation();
  const [mlpdAmount, setMlpdAmount] = useState('');
  const [lpdAmount, setLpdAmount] = useState('');
  const [reward, setReward] = useState(0);
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
          ethers.parseUnits(mlpdAmount, 18),
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
      await fetchReward();
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
      await fetchReward();
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
        mlpd: info[0] ? ethers.formatUnits(info[0], 18) : '0',
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
      const rewardValue = await getReward(signer, address);
      setReward(rewardValue ? ethers.formatUnits(rewardValue, 18) : '0');
    } catch (e) {
      setReward(0);
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
      <h2 className="text-xl font-bold mb-4">{t('tokens.poolMLPDLPD.title', 'Пул ликвидности MLPD/LPD')}</h2>
      <div className="mb-4">
        <label className="block mb-2">MLPD:</label>
        <input type="number" value={mlpdAmount} onChange={e => setMlpdAmount(e.target.value)} className="border px-3 py-2 rounded w-full" />
      </div>
      <div className="mb-4">
        <label className="block mb-2">LPD:</label>
        <input type="number" value={lpdAmount} onChange={e => setLpdAmount(e.target.value)} className="border px-3 py-2 rounded w-full" />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">{t('tokens.poolMLPDLPD.lockLabel', 'Срок блокировки')}</label>
        <div className="flex gap-2">
          <input
            type="number"
            min={lockUnit === 'hours' ? minLockHours : 1}
            className="border rounded px-2 py-1 w-32"
            value={lockValue}
            onChange={e => setLockValue(e.target.value)}
            placeholder={lockUnit === 'hours' ? t('tokens.poolMLPDLPD.minHours', {min: minLockHours, defaultValue: `Минимум ${minLockHours}`}) : t('tokens.poolMLPDLPD.min1', 'Минимум 1')}
          />
          <select
            className="border rounded px-2 py-1"
            value={lockUnit}
            onChange={e => setLockUnit(e.target.value)}
          >
            <option value="hours">{t('tokens.poolMLPDLPD.hours', 'Часы')}</option>
            <option value="days">{t('tokens.poolMLPDLPD.days', 'Дни')}</option>
          </select>
        </div>
        <div className="text-xs text-gray-500">{t('tokens.poolMLPDLPD.minHint', 'Минимальный срок: 12 часов. Если не указано — будет выбран минимум.')}</div>
      </div>
      <div className="mb-4 text-blue-700 font-semibold">{t('tokens.poolMLPDLPD.apr', 'Текущий APR')}: {apr ? apr + '%' : '—'}</div>
      <button onClick={handleAddLiquidity} disabled={loading || !isConnected} className="bg-blue-600 text-white px-4 py-2 rounded">
        {t('tokens.poolMLPDLPD.add', 'Добавить ликвидность')}
      </button>
      <button onClick={handleClaimReward} disabled={loading || !isConnected} className="bg-green-600 text-white px-4 py-2 rounded ml-2">
        {t('tokens.poolMLPDLPD.claim', 'Получить премию LPD')}
      </button>
      <button onClick={handleRemoveLiquidity} disabled={loading || !isConnected} className="bg-red-600 text-white px-4 py-2 rounded ml-2">
        {t('tokens.poolMLPDLPD.remove', 'Забрать ликвидность')}
      </button>
      {reward > 0 && (
        <div className="mt-4 text-green-600">{t('tokens.poolMLPDLPD.rewardToClaim', 'Премия к получению')}: {reward} LPD</div>
      )}
      {poolInfo && (
        <div className="mt-4 text-gray-700">
          <div>{t('tokens.poolMLPDLPD.yourPool', 'Ваш пул')}: {poolInfo.mlpd} MLPD / {poolInfo.lpd} LPD</div>
          <div>{t('tokens.poolMLPDLPD.lockPeriod', 'Срок блокировки')}: {poolInfo.lockPeriod ? (poolInfo.lockPeriod / 86400).toFixed(1) + ' ' + t('tokens.poolMLPDLPD.days', 'дней') : '-'}</div>
          <div>{t('tokens.poolMLPDLPD.lastDeposit', 'Последний депозит')}: {poolInfo.depositTime ? new Date(poolInfo.depositTime * 1000).toLocaleString() : '-'}</div>
          <div>{t('tokens.poolMLPDLPD.claimed', 'Получено премий')}: {poolInfo.claimedReward} LPD</div>
        </div>
      )}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
};

export default TokensPoolMLPDLPD;
