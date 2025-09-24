# Lapida Token — API & Integration Documentation (BNB Chain)

---

## 1. Введение

Lapida Token предоставляет открытые API и смарт-контракт интерфейсы для интеграции с внешними платформами, DEX, кошельками, мобильными приложениями и сервисами.  
Данный документ содержит примеры вызовов, ABI, схемы взаимодействия и рекомендации для интеграторов.

---

## 2. Основные смарт-контракт интерфейсы (ABI)

### 2.1. Token Contracts (LPD, MLPD, GLPD)

- **Standard:** BEP-20 (ERC-20 compatible)
- **Основные методы:**
  - `balanceOf(address account): uint256`
  - `transfer(address to, uint256 amount): bool`
  - `approve(address spender, uint256 amount): bool`
  - `transferFrom(address from, address to, uint256 amount): bool`
  - `mint(address to, uint256 amount): bool` *(только multisig/reserve)*
  - `burn(address from, uint256 amount): bool` *(только multisig/reserve)*

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

## 3. Интеграция с Web3 (пример на JavaScript/ethers.js)

```js
import { ethers } from "ethers";

const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
const tokenABI = [ /* ... ABI ... */ ];
const tokenAddress = "0x..."; // адрес токена

const contract = new ethers.Contract(tokenAddress, tokenABI, provider);

// Получить баланс
const balance = await contract.balanceOf("0xUserAddress");

// Отправить токены
const signer = provider.getSigner();
const contractWithSigner = contract.connect(signer);
await contractWithSigner.transfer("0xRecipient", ethers.utils.parseUnits("100", 18));
```

---

## 4. REST API (публичная интеграция)

Lapida Token предоставляет REST API для мониторинга балансов, транзакций, статусов вестинга и голосований.

- **GET /api/tokens/{address}** — баланс всех токенов пользователя
- **GET /api/vesting/{address}** — статус вестинга пользователя
- **GET /api/dao/proposals** — список активных предложений
- **POST /api/dao/vote** — отправить голос (требует подпись)
- **GET /api/sale/status** — статус сейла/раунда

*Swagger/OpenAPI спецификация будет опубликована на [lapida.one/api](https://lapida.one/api) после запуска.*

---

## 5. Интеграция с DEX и NFT

- **DEX:** PancakeSwap, Uniswap (BSC)
  - Используйте стандартные методы BEP-20 для свапов
  - Все адреса токенов — на [lapida.one](https://lapida.one)

- **NFT:** ERC-721/1155 совместимые контракты
  - Взаимодействие через Web3, OpenSea, TofuNFT и др.
  - Поддержка mint, transfer, list for sale

---

## 6. Безопасность интеграций

- Всегда используйте только официальные ABI и адреса контрактов с сайта [lapida.one](https://lapida.one)
- Проверяйте подписи и права доступа
- Для крупных интеграций — обращайтесь за технической поддержкой (support@lapida.one)

---

## 7. Примеры сценариев интеграции

- **Мобильное приложение:** подключение через WalletConnect, показ балансов, участие в голосовании DAO.
- **Сайт-партнер:** автоматический расчет и прием LPD/MLPD как оплаты.
- **Бот для Telegram:** уведомления о новых предложениях DAO, балансах, событиях.

---

## 8. Полезные ссылки

- **API документация:** [lapida.one/api](https://lapida.one/api)
- **GitHub контракты:** [github.com/lapida-project](https://github.com/lapida-project)
- **Swagger Spec:** будет опубликовано при запуске
- **DEX:** [PancakeSwap](https://pancakeswap.finance)
- **NFT:** [Opensea](https://opensea.io), [TofuNFT](https://tofunft.com)

---

*Документ обновляется по мере появления новых методов и интеграций.*
