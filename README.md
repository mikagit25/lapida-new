# Lapida - Цифровая платформа мемориалов

## 🚀 Быстрый запуск

### Автоматический запуск
```bash
# Запуск всего проекта (PowerShell)
powershell -ExecutionPolicy Bypass -File "d:\Mikalai\lapida-new\start-project.ps1"

# Или используйте BAT файлы:
start-client.bat   # Запуск frontend
start-server.bat   # Запуск backend
```

### Ручной запуск

#### Backend (сервер)
```bash
cd "d:\Mikalai\lapida-new\server"
npm run dev
# или
node app.js
```

#### Frontend (клиент)
```bash
cd "d:\Mikalai\lapida-new\client"
npm run dev
```
## 🚀 Быстрый запуск

### Автоматический запуск на свободных портах
```powershell
# Автоматически найдет свободные порты и запустит проект
.\auto-start.ps1

# Или с указанием предпочтительных портов
.\auto-start.ps1 -StartServerPort 3000 -StartClientPort 3001
```

### Запуск на конкретных портах
```powershell
# Установите переменные окружения
$env:PORT = "5007"              # Порт сервера
$env:CLIENT_PORT = "5182"       # Порт клиента
$env:VITE_API_URL = "http://localhost:5007"

# Запустите проект
.\start-both.ps1
```

### Запуск по умолчанию
```powershell
.\start-both.ps1
```

## 📱 URLs

- **Frontend**: Автоматически определяется (по умолчанию http://localhost:5182/)
- **Backend API**: Автоматически определяется (по умолчанию http://localhost:5007/)

## 🛠️ Технологии

### Frontend
- React 18
- Vite 7
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express 4
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- CORS

## 📁 Структура проекта

```
d:\Mikalai\lapida-new\
├── client\                 # React frontend
│   ├── src\
│   │   ├── components\     # React компоненты
│   │   ├── context\        # AuthContext
│   │   ├── pages\          # Страницы (Login, Register)
│   │   ├── services\       # API интеграция
│   │   └── App.jsx         # Главный компонент
│   ├── package.json
│   └── start-client.ps1
├── server\                 # Node.js backend
│   ├── models\             # MongoDB модели
│   │   ├── User.js         # Модель пользователя
│   │   └── Memorial.js     # Модель мемориала
│   ├── routes\             # API маршруты
│   │   ├── auth.js         # Аутентификация
│   │   ├── memorials.js    # Мемориалы
│   │   └── users.js        # Пользователи
│   ├── middleware\         # Middleware
│   │   └── auth.js         # JWT проверка
│   ├── app.js              # Основной сервер
│   ├── .env                # Переменные окружения
│   ├── package.json
│   └── start-server.ps1
├── start-client.bat        # Запуск клиента (Windows)
├── start-server.bat        # Запуск сервера (Windows)
└── start-project.ps1       # Запуск всего проекта
```

## 🔧 API Endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/profile` - Профиль пользователя
- `PUT /api/auth/profile` - Обновление профиля
- `GET /api/auth/verify` - Проверка токена

### Мемориалы
- `GET /api/memorials` - Список мемориалов
- `GET /api/memorials/:id` - Мемориал по ID
- `POST /api/memorials` - Создание мемориала
- `PUT /api/memorials/:id` - Обновление мемориала
- `DELETE /api/memorials/:id` - Удаление мемориала

## ⚙️ Настройка окружения

### Переменные окружения (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/lapida_db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Требования
- Node.js 18+
- MongoDB (локально или облако)
- npm или yarn

## 🚨 Решение проблем

### Проблема с Tailwind CSS
Если возникает ошибка PostCSS с Tailwind CSS 4.x:
```bash
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@3.4.1 postcss autoprefixer
```

### Проблема с директориями
Если терминал выходит в неправильную директорию, используйте BAT файлы:
```bash
cmd /c "d:\Mikalai\lapida-new\start-client.bat"
cmd /c "d:\Mikalai\lapida-new\start-server.bat"
```

### Проблема с портами
Если порты заняты, измените в:
- Frontend: vite автоматически найдет свободный порт
- Backend: измените PORT в .env файле

### Проблема с CORS
Убедитесь что в server/app.js настроены правильные origins для вашего frontend порта.

## 📝 Логи разработки

- ✅ Создан React frontend с Tailwind CSS
- ✅ Настроен Node.js/Express backend
- ✅ Интеграция с MongoDB
- ✅ JWT аутентификация
- ✅ Контекст авторизации в React
- ✅ Страницы входа и регистрации
- ✅ API сервисы для frontend-backend связи
- ✅ CORS настройки
- ✅ Скрипты для запуска проекта

## 🎯 Следующие шаги

1. Создание мемориалов
2. Загрузка фотографий
3. Система комментариев
4. Виртуальные цветы
5. Поиск и фильтрация
6. Админ панель
7. Мобильная адаптация
8. PWA функциональность
