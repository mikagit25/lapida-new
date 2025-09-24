import { ethers } from 'ethers';

// ABI для LiquidityPoolUSDTLPD
export const POOL_ABI = [
  "function addLiquidity(uint256 usdtAmount, uint256 lpdAmount, uint256 lockPeriod) external",
  "function claimReward() external",
  "function removeLiquidity() external",
  "function getProvider(address user) external view returns (uint256, uint256, uint256, uint256, uint256)",
  "function getReward(address user) external view returns (uint256)",
  "function apr() external view returns (uint256)"
];

// Адрес контракта пула (указать после деплоя)
export const POOL_ADDRESS = import.meta.env.VITE_POOL_ADDRESS || window.POOL_ADDRESS || "ВАШ_АДРЕС_ПУЛА";

export async function addLiquidity(signer, usdtAmount, lpdAmount, lockPeriod) {
  if (!POOL_ADDRESS || POOL_ADDRESS === "ВАШ_АДРЕС_ПУЛА") {
    throw new Error("Адрес пула не задан. Операция недоступна.");
  }
  const contract = new ethers.Contract(POOL_ADDRESS, POOL_ABI, signer);
  return await contract.addLiquidity(usdtAmount, lpdAmount, lockPeriod);
}

export async function claimReward(signer) {
  if (!POOL_ADDRESS || POOL_ADDRESS === "ВАШ_АДРЕС_ПУЛА") {
    throw new Error("Адрес пула не задан. Операция недоступна.");
  }
  const contract = new ethers.Contract(POOL_ADDRESS, POOL_ABI, signer);
  return await contract.claimReward();
}

export async function removeLiquidity(signer) {
  if (!POOL_ADDRESS || POOL_ADDRESS === "ВАШ_АДРЕС_ПУЛА") {
    throw new Error("Адрес пула не задан. Операция недоступна.");
  }
  const contract = new ethers.Contract(POOL_ADDRESS, POOL_ABI, signer);
  return await contract.removeLiquidity();
}

export async function getProvider(signer, userAddress) {
  if (!POOL_ADDRESS || POOL_ADDRESS === "ВАШ_АДРЕС_ПУЛА") {
    throw new Error("Адрес пула не задан. Операция недоступна.");
  }
  const contract = new ethers.Contract(POOL_ADDRESS, POOL_ABI, signer);
  return await contract.getProvider(userAddress);
}

export async function getReward(signer, userAddress) {
  if (!POOL_ADDRESS || POOL_ADDRESS === "ВАШ_АДРЕС_ПУЛА") {
    throw new Error("Адрес пула не задан. Операция недоступна.");
  }
  const contract = new ethers.Contract(POOL_ADDRESS, POOL_ABI, signer);
  return await contract.getReward(userAddress);
}

export async function getAPR(signer) {
  if (!POOL_ADDRESS || POOL_ADDRESS === "ВАШ_АДРЕС_ПУЛА") {
    throw new Error("Адрес пула не задан. Операция недоступна.");
  }
  const contract = new ethers.Contract(POOL_ADDRESS, POOL_ABI, signer);
  return await contract.apr();
}
