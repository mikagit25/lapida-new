# Lapida One - Цифровая платформа мемориалов

> Современная веб-платформа для создания и поддержания цифровых мемориалов близких людей

## 🚀 Особенности

- **Создание мемориалов** - Создавайте красивые цифровые страницы памяти
- **Фотогалереи** - Загружайте и комментируйте фотографии
- **Временная лента** - Создавайте хронологию жизни с событиями и фотографиями
- **Система комментариев** - Делитесь воспоминаниями и соболезнованиями
- **Безопасность** - JWT аутентификация и контроль доступа
- **Адаптивный дизайн** - Работает на всех устройствах

## 🛠️ Технологии

### Frontend
- **React 19** - Современная библиотека для создания пользовательских интерфейсов
- **Vite 7** - Быстрый сборщик и сервер разработки
- **Tailwind CSS** - Utility-first CSS фреймворк
- **React Router** - Маршрутизация для SPA
- **Axios** - HTTP клиент для API запросов

### Backend
- **Node.js** - JavaScript runtime для сервера
- **Express 4** - Веб-фреймворк для Node.js
- **MongoDB** - NoSQL база данных
- **Mongoose** - ODM для MongoDB
- **JWT** - Система аутентификации
- **Multer** - Middleware для загрузки файлов
- **bcryptjs** - Хеширование паролей

## 📁 Структура проекта

```
lapida-new/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── context/        # React контексты
│   │   ├── pages/          # Страницы приложения
│   │   └── services/       # API сервисы
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB модели
│   ├── routes/             # API маршруты
│   ├── middleware/         # Express middleware
│   └── package.json
└── README.md
```

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- MongoDB (локально или облако)
- Git

### Установка

1. **Клонируйте репозиторий**
```bash
git clone https://github.com/yourusername/lapida-new.git
cd lapida-new
```

2. **Установите зависимости сервера**
```bash
cd server
npm install
```

3. **Установите зависимости клиента**
```bash
cd ../client
npm install
```

4. **Настройте переменные окружения**
Создайте файл `server/.env`:
```env
PORT=5002
MONGODB_URI=mongodb://localhost:27017/lapida_db
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

### Запуск

#### Автоматический запуск (Windows)
```bash
# PowerShell
powershell -ExecutionPolicy Bypass -File "start-project.ps1"

# Или используйте BAT файлы
start-client.bat   # Запуск frontend
start-server.bat   # Запуск backend
```

#### Ручной запуск

**Backend (сервер)**
```bash
cd server
npm run dev
# или
node app.js
```

**Frontend (клиент)**
```bash
cd client
npm run dev
```

### URLs
- **Frontend**: http://localhost:5181/
- **Backend API**: http://localhost:5002/

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

## 📱 URLs

- **Frontend**: http://localhost:5176/
- **Backend API**: http://localhost:5001/
- **API Docs**: http://localhost:5001/api/

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
