import { ethers } from 'ethers';

export async function addLiquidity(provider, routerAddress, tokenA, tokenB, amountA, amountB) {
  // Пример взаимодействия с Uniswap/PancakeSwap Router
  const ROUTER_ABI = [
    'function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)',
  ];
  const signer = await provider.getSigner();
  const router = new ethers.Contract(routerAddress, ROUTER_ABI, signer);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;
  // approve tokens if needed
  // ...
  const tx = await router.addLiquidity(
    tokenA,
    tokenB,
    ethers.parseUnits(amountA, 18),
    ethers.parseUnits(amountB, 18),
    0,
    0,
    await signer.getAddress(),
    deadline
  );
  await tx.wait();
  return tx.hash;
}

export async function removeLiquidity(provider, routerAddress, tokenA, tokenB, liquidityAmount) {
  // TODO: реализовать удаление ликвидности через Router
  return '0xFAKE_REMOVE_TX'; // для MVP
}
