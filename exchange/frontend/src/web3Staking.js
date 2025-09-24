import { ethers } from 'ethers';

export async function stakeTokens(provider, stakingAddress, amount) {
  // Пример взаимодействия с контрактом стейкинга
  // Требуется ABI и адрес контракта
  const STAKING_ABI = [
    'function stake(uint256 amount) public',
    'event Staked(address indexed user, uint256 amount, uint256 mlpd)'
  ];
  const signer = await provider.getSigner();
  const staking = new ethers.Contract(stakingAddress, STAKING_ABI, signer);
  // approve LPD spending (если требуется)
  // ...
  const tx = await staking.stake(ethers.parseUnits(amount, 18));
  await tx.wait();
  // Для MVP: возвращаем tx.hash и начисленное MLPD (заглушка)
  return { txHash: tx.hash, mlpd: (parseFloat(amount) * 0.1).toFixed(2) }; // 10% APR для примера
}
