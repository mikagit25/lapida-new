# Lapida DEX Backend API Documentation

## Общие сведения
Все эндпоинты используют JSON. Для тестирования можно использовать Postman или curl.

---

## 1. Ликвидность
### GET /api/liquidity
- Описание: Получить историю операций с ликвидностью.
- Ответ: `{ history: [...] }`

### POST /api/liquidity
- Описание: Добавить операцию ликвидности.
- Тело:
  - wallet (string)
  - amountA (number)
  - amountB (number)
  - action (string: 'add'|'remove')
  - txHash (string)
  - timestamp (number, optional)
- Ответ: `{ success: true }`

---

## 2. Обмен
### GET /api/exchange
- Описание: Получить историю обменов.
- Ответ: `{ history: [...] }`

### POST /api/exchange
- Описание: Добавить операцию обмена.
- Тело:
  - wallet (string)
  - stablecoin (string)
  - amount (number)
  - txHash (string)
  - timestamp (number, optional)
- Ответ: `{ success: true }`

---

## 3. Стейкинг
### GET /api/staking
- Описание: Получить историю стейкинга.
- Ответ: `{ history: [...] }`

### POST /api/staking
- Описание: Добавить операцию стейкинга.
- Тело:
  - wallet (string)
  - amount (number)
  - txHash (string)
  - mlpd (number)
  - timestamp (number, optional)
- Ответ: `{ success: true }`

---

## 4. Аналитика
### GET /api/analytics
- Описание: Получить статистику по всем операциям.
- Ответ: `{ stats: { liquidityCount, exchangeCount, stakingCount, lastLiquidity, lastExchange, lastStaking } }`

---

## 5. Прокси для DEX
### POST /api/proxy
- Описание: Прокси-запрос к DEX (реализуется).
- Тело: `{ ... }`
- Ответ: `{ result: 'ok' }` или `{ error }`

---

## Примеры запросов
(см. выше для структуры тела)

---

## TODO
- Добавить авторизацию и работу с БД.
- Реализовать прокси для DEX.
- Расширить аналитику.
