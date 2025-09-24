# Инструкция по деплою и верификации токена Lapida (BEP-20, BNB Chain)

## 1. Установка инструментов
- Установите Node.js и npm
- Установите Hardhat: `npm install --save-dev hardhat`
- Установите OpenZeppelin Contracts: `npm install @openzeppelin/contracts`

## 2. Инициализация проекта
- В директории с контрактом выполните: `npx hardhat init`
- Скопируйте файл `LapidaToken_BEP20_Template.sol` в папку `contracts/`

## 3. Конфигурация сети BSC
- В `hardhat.config.js` добавьте:
```js
module.exports = {
  networks: {
    bsc: {
      url: 'https://bsc-dataseed.binance.org/',
      accounts: ['PRIVATE_KEY'] // замените на ваш приватный ключ
    }
  },
  solidity: '0.8.0',
};
```

## 4. Деплой контракта
- Создайте скрипт деплоя `scripts/deploy.js`:
```js
async function main() {
  const LapidaToken = await ethers.getContractFactory('LapidaToken');
  const token = await LapidaToken.deploy('Lapida Token', 'LPD');
  await token.deployed();
  console.log('Token deployed to:', token.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```
- Запустите деплой: `npx hardhat run scripts/deploy.js --network bsc`

## 5. Верификация контракта
- Получите адрес контракта после деплоя.
- Верифицируйте контракт через BscScan:
  - Перейдите на https://bscscan.com/verifyContract
  - Вставьте исходный код и параметры конструктора.

## 6. Тестирование
- Проверьте функции mint, burn, pause через Hardhat или Remix.
- Проверьте события и права доступа.

## 7. Листинг токена
- После деплоя добавьте токен в MetaMask (адрес, символ, decimals).
- Подготовьте заявку на PancakeSwap, TofuNFT и другие платформы.

## 8. Безопасность
- Не публикуйте приватные ключи.
- Проведите аудит контракта.
- Используйте multisig для управления mint/burn.

---

## Пример адреса для теста:
- BSC Testnet: https://testnet.bscscan.com/
- Mainnet: https://bscscan.com/

---

## Дополнительно
- Для MLPD и GLPD используйте отдельные контракты с нужной логикой (stake, vote, delegate).
- Для вестинга и DAO используйте OpenZeppelin Governor, Timelock, Vesting.
