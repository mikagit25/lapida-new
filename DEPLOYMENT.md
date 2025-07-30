# Инструкции по развертыванию

## Для разработчиков

### 1. Настройка репозитория на GitHub

1. Создайте новый репозиторий на GitHub
2. Добавьте remote origin:
```bash
git remote add origin https://github.com/yourusername/lapida-new.git
git branch -M main
git push -u origin main
```

### 2. Локальная разработка

```bash
# Установка зависимостей
cd server && npm install
cd ../client && npm install

# Запуск в режиме разработки
npm run dev  # в папке server
npm run dev  # в папке client
```

### 3. Структура API

#### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/profile` - Профиль пользователя
- `PUT /api/auth/profile` - Обновление профиля

#### Мемориалы
- `GET /api/memorials` - Список мемориалов
- `GET /api/memorials/share/:shareUrl` - Мемориал по shareUrl
- `POST /api/memorials` - Создание мемориала
- `PUT /api/memorials/:id` - Обновление мемориала
- `DELETE /api/memorials/:id` - Удаление мемориала

#### Timeline события
- `GET /api/timeline/timeline` - События мемориала
- `POST /api/timeline/memorial/:memorialId/timeline` - Создание события
- `PUT /api/timeline/timeline/:eventId` - Обновление события
- `DELETE /api/timeline/timeline/:eventId` - Удаление события

#### Комментарии
- `GET /api/comments/memorial/:memorialId` - Комментарии мемориала
- `POST /api/comments` - Создание комментария
- `PUT /api/comments/:id` - Обновление комментария
- `DELETE /api/comments/:id` - Удаление комментария

#### Фото-комментарии
- `GET /api/photo-comments/memorial/:memorialId/photo` - Комментарии к фото
- `POST /api/photo-comments/memorial/:memorialId/photo/comment` - Добавить комментарий к фото
- `DELETE /api/photo-comments/comment/:commentId` - Удалить комментарий к фото

#### Загрузка файлов
- `POST /api/upload/single` - Загрузка одного файла
- `POST /api/upload/gallery` - Загрузка нескольких файлов

## Production развертывание

### Переменные окружения для production

```env
PORT=5002
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lapida_db
JWT_SECRET=secure_random_string_here
NODE_ENV=production
```

### Сборка frontend

```bash
cd client
npm run build
```

### Запуск production сервера

```bash
cd server
npm start
```

## Безопасность

- Все пароли хешируются с помощью bcryptjs
- JWT токены для аутентификации
- CORS настроен для безопасности
- Валидация входных данных на сервере
- Санитизация файлов при загрузке
