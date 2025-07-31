# Инструкция для Node.js хостинга Hoster.by

## 🚀 Node.js хостинг - полный функционал

### Шаг 1: Подготовка backend
1. Создайте архив `server.zip` из папки `server/`
2. Или загрузите файлы из папки `server/` через файловый менеджер

### Шаг 2: Размещение backend
1. В панели управления найдите раздел "Node.js" или "Node.js приложения"
2. Создайте новое приложение
3. Загрузите файлы из папки `server/`
4. Установите зависимости: `npm install`
5. Стартовый файл: `app.js`
6. Порт: оставьте по умолчанию (обычно автоматически)

### Шаг 3: Настройка переменных окружения
В панели Node.js приложения добавьте переменные:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lapida_db
JWT_SECRET=ваш_секретный_ключ_для_jwt
```

### Шаг 4: Размещение frontend
1. Соберите frontend: `npm run build` в папке `client/`
2. Загрузите содержимое `client/dist/` в папку `public_html/`
3. Создайте `.htaccess` для проксирования API

### Шаг 5: Настройка проксирования
Создайте `.htaccess` в `public_html/` с таким содержимым:
```apache
# Проксирование API запросов на Node.js приложение
RewriteEngine On

# API запросы направляем на Node.js приложение
RewriteCond %{REQUEST_URI} ^/api/ [NC]
RewriteRule ^api/(.*)$ http://localhost:ПОРТ_NODEJS/api/$1 [P,L]

# Upload запросы тоже на Node.js
RewriteCond %{REQUEST_URI} ^/upload/ [NC]
RewriteRule ^upload/(.*)$ http://localhost:ПОРТ_NODEJS/upload/$1 [P,L]

# Все остальное - React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

## 🔧 Альтернативный способ - все в Node.js

### Настройка для полного размещения в Node.js
Можно разместить и frontend, и backend в одном Node.js приложении:

1. Скопируйте файлы из `client/dist/` в `server/public/`
2. Обновите `server/app.js` для раздачи статики
3. Загрузите весь проект в Node.js приложение

## 📁 Структура для Node.js размещения:
```
nodejs-app/
├── app.js (главный файл)
├── package.json
├── node_modules/
├── models/
├── routes/
├── middleware/
├── upload/
└── public/ (если frontend тоже в Node.js)
    ├── index.html
    ├── assets/
    └── ...
```

## ⚙️ Настройки в панели хостинга:
- **Стартовый файл:** app.js
- **Версия Node.js:** 16+ (если доступно)
- **Автозапуск:** Включить
- **Переменные окружения:** Настроить как указано выше
