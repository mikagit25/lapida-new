# Lapida Token — Technical Architecture (BNB Chain)

---

## 1. Overview

Lapida Token operates on the BNB Chain, utilizing a multi-token architecture (LPD, MLPD, GLPD), a modular smart contract system, and robust DAO governance.  
The platform is designed for security, scalability, and seamless integrations with Web3 services.

---

## 2. Main Components

### 2.1. Token Contracts

- **LPD (Lapida Stablecoin):** BEP-20 token, reserve-backed mint/burn.
- **MLPD (Lapida Utility):** BEP-20 token, fixed supply, staking/farming enabled.
- **GLPD (Governance):** BEP-20 token, voting/delegation for DAO.

### 2.2. Reserve Contract

- Manages stablecoin reserves (USDT, USDC, BNB).
- Controls mint/burn of LPD under multisig and DAO/timelock.
- Tracks platform funds and ensures transparency.

### 2.3. Vesting Contracts

- Implements linear and cliff vesting for allocations.
- Prevents early withdrawal; all schedules are public.
- Unlocking managed via user dashboard and smart contract.

### 2.4. DAO & Governance Contracts

- **Governor:** Handles proposals, voting, execution.
- **Timelock:** Delays critical actions, allows review period.
- **ProposalFactory:** Automates proposal creation and management.

### 2.5. Sale Contracts

- IDO/Pre-sale management: whitelist, allocation, claiming.
- Public sale contract for PancakeSwap listing and liquidity provision.

### 2.6. NFT & Memorial Contracts

- ERC-721/ERC-1155 compatible contracts for digital memorials.
- Integration with external NFT platforms (TofuNFT, OpenSea).

---

## 3. Integration Layer

- **API:** REST/GraphQL endpoints for data, voting, balances.
- **Web3 Interface:** MetaMask, WalletConnect, TrustWallet, Binance Chain Wallet.
- **DEX Integration:** PancakeSwap, Uniswap (BSC).

---

## 4. Security Features

- Multisig and timelock for critical functions.
- Audit-ready, open-source code (OpenZeppelin, SOLIDproof).
- ReentrancyGuard, SafeMath, access controls throughout contracts.

---

## 5. Scalability & Upgradability

- Modular contracts — upgrade via DAO proposals.
- API designed for third-party service integration.
- Roadmap includes expansion to Polygon, Ethereum, etc.

---

## 6. Diagram (Textual)

```
[User] <-> [Web3 Interface] <-> [Lapida Smart Contracts]
        |        |                  |-- LPD / MLPD / GLPD Tokens
        |        |                  |-- Vesting / Reserve / Sale / DAO
        |        |                  |-- NFT / Memorial Contracts
        |        |                  |-- API / Integration Layer
        |        |                  |-- DEX / Partner Services
```

---

## 7. Useful Links

- **GitHub:** [github.com/lapida-project](https://github.com/lapida-project)
- **API docs:** [lapida.one/api](https://lapida.one/api)
- **Smart contract audit:** [lapida.one/security](https://lapida.one/security)
- **Platform:** [lapida.one](https://lapida.one)

---

*Document updated with changes in technical architecture and integrations.*
