# Документация по API и компонентам маркетплейса

## Основные API

### Заказы
- `POST /api/orders` — создание заказа
  - body: `{ items, name, phone, address, companyId }`
  - response: `{ order }`
- `GET /api/orders/user/:userId` — заказы пользователя
- `GET /api/orders/company/:companyId` — заказы компании
- `PATCH /api/orders/:orderId/status` — смена статуса заказа
  - body: `{ status, comment }`

### Уведомления
- `GET /api/notifications/user/:userId` — уведомления пользователя
- `GET /api/notifications/company/:companyId` — уведомления компании
- `PATCH /api/notifications/:notificationId/read` — отметить уведомление как прочитанное
- `PATCH /api/notifications/user/:userId/read-all` — отметить все уведомления пользователя как прочитанные
- `PATCH /api/notifications/company/:companyId/read-all` — отметить все уведомления компании как прочитанные

### Корзина
- Хранится на фронтенде в localStorage, отправляется при оформлении заказа

## Основные компоненты фронтенда
- `Cart.jsx` — корзина пользователя
- `Checkout.jsx` — оформление заказа
- `UserOrders.jsx` — список заказов пользователя
- `CompanyOrders.jsx` — список заказов компании
- `OrderDetails.jsx` — детали заказа
- `NotificationsList.jsx` — уведомления пользователя
- `CompanyNotificationsList.jsx` — уведомления компании

## Примеры запросов

**Создание заказа:**
```json
POST /api/orders
{
  "items": [{ "productId": "...", "name": "...", "price": 100, "quantity": 1, "companyId": "..." }],
  "name": "Иван",
  "phone": "+380...",
  "address": "Киев",
  "companyId": "..."
}
```

**Смена статуса заказа:**
```json
PATCH /api/orders/123/status
{
  "status": "confirmed",
  "comment": "Оплата получена"
}
```

**Получение уведомлений пользователя:**
```
GET /api/notifications/user/123
```

**Отметить все уведомления как прочитанные:**
```
PATCH /api/notifications/user/123/read-all
```

---

Для расширения функционала добавляйте новые типы уведомлений, интеграцию с внешними сервисами, тесты и документацию по новым компонентам.
