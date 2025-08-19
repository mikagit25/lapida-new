# План интеграции ERPNext CRM в проект Lapida

## Текущий статус
- Проект на Node.js, MongoDB, React.
- Заказы реализованы вручную, но требуется полноценная CRM-система.
- Выбран ERPNext как оптимальное open-source CRM/ERP для интеграции.
- Подготовлен docker-compose.erpnext.yml для запуска ERPNext в отдельном контейнере.
- Кнопка перехода к заказам из личного кабинета реализована.

## Этапы интеграции
1. **Установка Docker Desktop**
   - Скачать с https://www.docker.com/products/docker-desktop/
   - Установить и проверить команду `docker compose version`.
2. **Запуск ERPNext**
   - В корне проекта выполнить:
     ```
     docker compose -f docker-compose.erpnext.yml up -d
     ```
   - ERPNext будет доступен на http://localhost:8080
3. **Первичная настройка ERPNext**
   - Создать сайт, пользователя, включить модуль Sales (заказы, клиенты, товары).
4. **Интеграция с фронтом**
   - Использовать REST API ERPNext для работы с заказами:
     - Получение заказов: `/api/resource/Sales Order`
     - Создание заказа: POST `/api/resource/Sales Order`
   - Пример запроса:
     ```js
     import axios from 'axios';
     const ERP_API = 'http://localhost:8080/api/resource/Sales Order';
     export async function getErpOrders(token) {
       const res = await axios.get(ERP_API, { headers: { Authorization: `token ${token}` } });
       return res.data.data;
     }
     ```
5. **Создание отдельного React-блока для заказов ERPNext**
   - Новый компонент (например, `ErpOrdersBlock.jsx`) для отображения заказов через API ERPNext.
   - Переход на этот блок из личного кабинета по кнопке.
6. **Кастомизация и расширение**
   - Постепенно добавлять нужные функции, интеграции, UI.
   - Все изменения — отдельным блоком, не ломая основной проект.

## Важно для восстановления сессии
- Все ключевые решения, планы и инструкции сохранены в этом файле.
- После перезапуска: продолжить с этапа, где остановились, сверяясь с этим планом.
- Для отправки на GitHub:
  ```
  git add .
  git commit -m "ERPNext CRM integration: docker-compose, план, подготовка к API"
  git push
  ```

## Контакты и доступ
- ERPNext: http://localhost:8080
- Документация ERPNext API: https://frappeframework.com/docs/v14/user/en/api/rest_api

---
Этот файл поможет быстро восстановить контекст и продолжить интеграцию CRM в проект Lapida.
