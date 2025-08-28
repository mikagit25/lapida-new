# Инструкция по деплою и переключению окружений

## 1. Локальная разработка
- Сервер: используйте `server/.env` с портом 5005
- Фронтенд: используйте `client/.env` с адресом `http://localhost:5005/api`
- Запуск:
  - Сервер: `node server/app.js` или через ваш скрипт
  - Фронт: `npm run dev` в папке client

## 2. Продакшен/хостинг
- Сервер: используйте `server/.env.production` с портом 10000
- Фронтенд: используйте `client/.env.production` с адресом `https://lapida.one/api`
- Перед запуском:
  - Скопируйте env-файлы:
    - `cp server/.env.production server/.env`
    - `cp client/.env.production client/.env`
  - Соберите фронт: `cd client && npm run build`
  - Запустите сервер: `node server/app.js` или через pm2/systemd

## 3. Быстрый скрипт для переключения окружения

```bash
#!/bin/bash
# deploy-env.sh
# Копирует production env-файлы для деплоя
cp server/.env.production server/.env
cp client/.env.production client/.env
cd client && npm run build
```

## 4. Важно
- Не коммитьте реальные секреты и пароли в репозиторий!
- Для теста локально используйте только локальные env-файлы.
- Для продакшена — production env-файлы.

---

**Вопросы по деплою, автоматизации, настройке nginx — пишите!**
