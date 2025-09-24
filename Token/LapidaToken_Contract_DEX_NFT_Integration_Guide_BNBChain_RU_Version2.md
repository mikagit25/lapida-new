# Lapida Token — Гайд по работе с контрактами, интеграции DEX и NFT (BNB Chain, RU)

---

## 1. Введение

Этот гайд предназначен для разработчиков, интеграторов и активных пользователей Lapida Token, желающих работать с контрактами, подключать токены к DEX (PancakeSwap, Uniswap), создавать и управлять мемориальными NFT.

---

## 2. Адреса и ABI контрактов

- **Официальные адреса и ABI:**  
  - [lapida.one/contracts](https://lapida.one/contracts)  
  - [github.com/lapida-project](https://github.com/lapida-project)

- **Типы контрактов:**  
  - LPD, MLPD, GLPD (BEP-20)  
  - DAO (Governor, Timelock)  
  - Vesting  
  - NFT (ERC-721, ERC-1155)

---

## 3. Работа с контрактами через Web3

### 3.1. Подключение (JS/ethers.js)

```js
import { ethers } from "ethers";
const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
```

### 3.2. Чтение баланса токена

```js
const balance = await contract.balanceOf("0xUserAddress");
console.log("Balance:", ethers.utils.formatUnits(balance, 18));
```

### 3.3. Перевод токенов

```js
const signer = provider.getSigner();
const contractWithSigner = contract.connect(signer);
await contractWithSigner.transfer("0xRecipient", ethers.utils.parseUnits("10", 18));
```

### 3.4. Взаимодействие с DAO

- Голосование:  
  `await daoContract.castVote(proposalId, support);`
- Создание предложения:  
  `await daoContract.propose(targets, values, calldatas, description);`

### 3.5. Работа с Vesting

- Проверка разблокированных токенов:  
  `await vestingContract.releasableAmount("0xYourAddress");`
- Получение токенов:  
  `await vestingContract.release();`

---

## 4. Интеграция с DEX (PancakeSwap, Uniswap)

### 4.1. Добавление токена в интерфейс DEX

- Откройте PancakeSwap/Uniswap  
- "Import Token" → вставьте официальный адрес токена  
- Проверьте название и символ

### 4.2. Добавление ликвидности

- Перейдите в раздел "Liquidity"  
- Выберите пары (например, LPD/BNB)  
- Введите сумму, подтвердите транзакцию через WalletConnect/MetaMask

### 4.3. Swap токенов через интерфейс

- Выберите токен Lapida в списке  
- Укажите количество, подтвердите swap

### 4.4. Swap через контракт

```js
const router = new ethers.Contract(ROUTER_ADDRESS, ROUTER_ABI, signer);
await router.swapExactTokensForTokens(
  amountIn, amountOutMin, [LPD_ADDRESS, BNB_ADDRESS], userAddress, deadline
);
```

### 4.5. Важно для безопасности

- Проверяйте адрес пула и токена  
- Используйте slippage 0.5–2%  
- Не совершайте большие сделки без теста

---

## 5. Интеграция и работа с NFT

### 5.1. Mint NFT мемориала

```js
await nftContract.mint("0xRecipient", tokenURI); // tokenURI — JSON с метаданными
```

**Пример metadata:**
```json
{
  "name": "Memorial NFT",
  "description": "Digital memory of John Doe",
  "image": "ipfs://Qm.../image.jpg",
  "attributes": [
    {"trait_type": "Date", "value": "2025-01-01"}
  ]
}
```

### 5.2. Передача NFT другому пользователю

```js
await nftContract.safeTransferFrom("0xSender", "0xRecipient", tokenId);
```

### 5.3. Продажа NFT на маркетплейсах

- Импортируйте контракт в TofuNFT/OpenSea  
- Свяжите кошелек, выставьте NFT на продажу  
- Проверьте, что NFT виден и доступен для покупки

### 5.4. Получение списка NFT пользователя

```js
const balance = await nftContract.balanceOf("0xUser");
const tokenId = await nftContract.tokenOfOwnerByIndex("0xUser", idx);
```

---

## 6. Безопасность и best practices

- Проверяйте адреса контрактов только через официальные источники
- Не раскрывайте приватные ключи
- Используйте multisig для управления резервами и DAO
- Проверяйте статус транзакций через BSCscan
- При ошибках: проверьте сеть, ABI, лимит газа

---

## 7. Частые ошибки

- Недостаточно BNB для газа
- Неверный ABI или адрес
- Сеть кошелька не совпадает (BSC)
- Slippage слишком мал для swap
- Метаданные NFT некорректны

---

## 8. FAQ и поддержка

- [lapida.one/support](https://lapida.one/support)
- [t.me/lapida_one](https://t.me/lapida_one)
- [github.com/lapida-project/issues](https://github.com/lapida-project/issues)

---

*Для расширенной документации и свежих ABI используйте официальный сайт и репозиторий GitHub Lapida.*
