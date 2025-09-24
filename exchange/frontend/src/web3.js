import { ethers } from 'ethers';

export async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('MetaMask not found');
}

export async function swapStableToLPD(provider, stableAddress, lpdAddress, amount) {
  // Пример взаимодействия с Uniswap V2 Router
  // Требуется адрес роутера и ABI
  const UNISWAP_ROUTER_ADDRESS = '0x...'; // адрес Uniswap/PancakeSwap Router
  const UNISWAP_ROUTER_ABI = [
    // только нужные методы
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
  ];
  const signer = await provider.getSigner();
  const router = new ethers.Contract(UNISWAP_ROUTER_ADDRESS, UNISWAP_ROUTER_ABI, signer);
  const path = [stableAddress, lpdAddress];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 минут
  // approve stablecoin spending
  const stableAbi = [
    'function approve(address spender, uint amount) public returns (bool)'
  ];
  const stable = new ethers.Contract(stableAddress, stableAbi, signer);
  await stable.approve(UNISWAP_ROUTER_ADDRESS, ethers.parseUnits(amount, 18));
  // swap
  const tx = await router.swapExactTokensForTokens(
    ethers.parseUnits(amount, 18),
    0, // минимальный выход (можно добавить расчет через getAmountsOut)
    path,
    await signer.getAddress(),
    deadline
  );
  await tx.wait();
  return tx.hash;
}
