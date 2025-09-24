# Lapida Token — Smart Contracts Specification (BNB Chain)

---

## 1. Схема взаимодействия контрактов

```
[SaleContract] → [TokenContracts: LPD, MLPD, GLPD]
           ↓              ↓
[ВестингКонтракты] ← [DAO (Governor, Timelock)]
           ↓              ↓
      [Multisig]      [ReserveContract]
```
---

## 2. Спецификация токен-контрактов

### 2.1. LPD (Stablecoin)
- **Стандарт:** BEP-20
- **Функции:**
  - `mint(address to, uint256 amount)` — выпуск новых токенов (только Reserve/Multisig)
  - `burn(address from, uint256 amount)` — уничтожение токенов
  - `pause()` / `unpause()` — экстренная блокировка (Multisig)
- **События:** `Minted`, `Burned`, `Paused`, `Unpaused`
- **Права:** Mint/Burn доступны только ReserveContract и Multisig

### 2.2. MLPD (Utility/DeFi)
- **Стандарт:** BEP-20, фиксированная эмиссия
- **Функции:**
  - `transfer`, `approve`, `transferFrom` стандартные
  - `stake(uint256 amount)` — стейкинг (через DeFi контракт)
  - `farm(uint256 amount)` — фарминг (через DeFi контракт)
- **События:** `Staked`, `Farmed`
- **Права:** Управление наградами через DAO

### 2.3. GLPD (Governance)
- **Стандарт:** BEP-20, ограниченная эмиссия
- **Функции:**
  - `delegate(address to)` — делегирование голосов
  - `vote(uint256 proposalId, bool support)` — голосование
- **События:** `Delegated`, `Voted`
- **Права:** Голосование, управление предложениями DAO

---

## 3. Вестинг-контракт

- **Функции:**
  - `initialize(address beneficiary, uint256 totalAmount, uint64 start, uint64 cliff, uint64 duration)`
  - `release()` — разблокировка доступных токенов
  - `releasableAmount()` — просмотр доступного для вывода количества
  - `vestedAmount()` — просмотр общей суммы разблокированных токенов
- **События:** `TokensReleased`
- **Параметры:** beneficiary, cliff, duration, start, totalAmount, released

---

## 4. DAO-контракты

### 4.1. Governor.sol
- **Функции:**
  - `propose(address[] targets, uint256[] values, bytes[] calldatas, string description)`
  - `castVote(uint256 proposalId, bool support)`
  - `queue(uint256 proposalId)`
  - `execute(uint256 proposalId)`
- **События:** `ProposalCreated`, `VoteCast`, `ProposalExecuted`

### 4.2. Timelock.sol
- **Функции:**
  - `schedule(address target, uint256 value, bytes calldata, uint256 delay)`
  - `execute(address target, uint256 value, bytes calldata)`
- **События:** `Scheduled`, `Executed`

### 4.3. ProposalFactory.sol
- **Функции:**  
  - `createProposal(...)` — создание новых предложений
- **Права:** Proposer может быть любым GLPD holder с определённым порогом

---

## 5. Sale-контракт (IDO / Pre-sale)

- **Функции:**
  - `buyTokens(address buyer, uint256 amount)` — покупка токенов
  - `setWhitelist(address[] users)` — управление whitelist
  - `finalizeSale()` — завершение сейла, распределение токенов
- **События:** `TokensBought`, `SaleFinalized`
- **Параметры:** min/max лимиты, кап сейла, whitelist

---

## 6. Reserve-контракт

- **Функции:**
  - `deposit(uint256 amount)` — пополнение резерва
  - `withdraw(uint256 amount)` — вывод средств (только Multisig)
  - `getReserveBalance()` — просмотр баланса резерва
  - `mintLPD(address to, uint256 amount)` — выпуск LPD под обеспечение
- **События:** `Deposited`, `Withdrawn`, `LPDMinted`
- **Права:** Управляется Multisig

---

## 7. Multisig-контракт

- **Функции:**
  - `submitTransaction(address to, uint256 value, bytes data)`
  - `confirmTransaction(uint256 txId)`
  - `executeTransaction(uint256 txId)`
- **События:** `TransactionSubmitted`, `TransactionConfirmed`, `TransactionExecuted`
- **Параметры:** minConfirmations, owners

---

## 8. Взаимодействие и вызовы

- SaleContract вызывает mint токенов LPD/MLPD для пользователей
- ВестингКонтракты получают токены и управляют разблокировкой
- DAO-контракт может предлагать изменения параметров Sale, Reserve, Token, вестинга
- Multisig — “финальный ключ” для критических операций (mint/burn, вывод из резерва)

---

## 9. Требования по безопасности

- Все критические функции доступны только через Multisig
- Контракты проходят аудит, исходники публикуются на GitHub
- Timelock для операций DAO, защита от мгновенных изменений
- Защита от reentrancy, проверка входных параметров, ограничения на max supply

---

## 10. Ссылки на исходники и тесты

- [github.com/lapida-project/contracts](#) — токены, DAO, вестинг, резерв, multisig
- [github.com/lapida-project/tests](#) — тесты для каждого контракта
- [Документация по API и ABI](#) — описание интерфейсов и примеров вызова

---

*Документ обновляется по мере публикации новых контрактов и исходного кода.*
