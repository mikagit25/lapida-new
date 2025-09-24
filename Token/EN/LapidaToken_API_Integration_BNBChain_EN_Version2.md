# Lapida Token — API & Integration Documentation (BNB Chain)

---

## 1. Introduction

Lapida Token provides open APIs and smart contract interfaces for integration with external platforms, DEX, wallets, mobile apps, and services.  
This document includes call examples, ABI, interaction schemes, and recommendations for integrators.

---

## 2. Main Smart Contract Interfaces (ABI)

### 2.1. Token Contracts (LPD, MLPD, GLPD)

- **Standard:** BEP-20 (ERC-20 compatible)
- **Key Methods:**
  - `balanceOf(address account): uint256`
  - `transfer(address to, uint256 amount): bool`
  - `approve(address spender, uint256 amount): bool`
  - `transferFrom(address from, address to, uint256 amount): bool`
  - `mint(address to, uint256 amount): bool` *(multisig/reserve only)*
  - `burn(address from, uint256 amount): bool` *(multisig/reserve only)*

### 2.2. Vesting Contract

- `releasableAmount(address beneficiary): uint256`
- `release(): void`
- `vestedAmount(address beneficiary): uint256`
- `getVestingSchedule(address beneficiary): struct`

### 2.3. DAO Contracts

- `propose(address[] targets, uint256[] values, bytes[] calldatas, string description): uint256`
- `castVote(uint256 proposalId, bool support): void`
- `delegate(address to): void`
- `queue(uint256 proposalId): void`
- `execute(uint256 proposalId): void`

### 2.4. Sale Contract

- `buyTokens(address buyer, uint256 amount): void`
- `setWhitelist(address[] users): void`
- `finalizeSale(): void`

---

## 3. Web3 Integration (JavaScript/ethers.js Example)

```js
import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
const tokenABI = [ /* ... ABI ... */ ];
const tokenAddress = "0x..."; // token address

const contract = new ethers.Contract(tokenAddress, tokenABI, provider);

// Get balance
const balance = await contract.balanceOf("0xUserAddress");

// Send tokens
const signer = provider.getSigner();
const contractWithSigner = contract.connect(signer);
await contractWithSigner.transfer("0xRecipient", ethers.utils.parseUnits("100", 18));
```

---

## 4. REST API (Public Integration)

Lapida Token provides REST APIs for monitoring balances, transactions, vesting status, and DAO voting.

- **GET /api/tokens/{address}** — user’s token balances
- **GET /api/vesting/{address}** — user’s vesting status
- **GET /api/dao/proposals** — list of active proposals
- **POST /api/dao/vote** — cast a vote (requires signature)
- **GET /api/sale/status** — sale/round status

*Swagger/OpenAPI specification will be published at [lapida.one/api](https://lapida.one/api) after launch.*

---

## 5. DEX & NFT Integration

- **DEX:** PancakeSwap, Uniswap (BSC)
  - Use standard BEP-20 methods for swaps
  - All token addresses listed on [lapida.one](https://lapida.one)

- **NFT:** ERC-721/1155 compatible contracts
  - Interact via Web3, OpenSea, TofuNFT, etc.
  - Supports mint, transfer, list for sale

---

## 6. Integration Security

- Always use official ABI and contract addresses from [lapida.one](https://lapida.one)
- Check signatures and access rights
- For major integrations — request technical support (support@lapida.one)

---

## 7. Example Integration Scenarios

- **Mobile App:** connect via WalletConnect, display balances, participate in DAO voting.
- **Partner Website:** automatic calculation and acceptance of LPD/MLPD as payment.
- **Telegram Bot:** notifications about new DAO proposals, balances, events.

---

## 8. Useful Links

- **API documentation:** [lapida.one/api](https://lapida.one/api)
- **GitHub contracts:** [github.com/lapida-project](https://github.com/lapida-project)
- **Swagger Spec:** will be published upon launch
- **DEX:** [PancakeSwap](https://pancakeswap.finance)
- **NFT:** [Opensea](https://opensea.io), [TofuNFT](https://tofunft.com)

---

*Document is updated as new methods and integrations appear.*
