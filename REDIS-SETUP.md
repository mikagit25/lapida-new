# Установка и настройка Redis для проекта Lapida

## Зачем нужен Redis?

Redis используется для:
- **Кэширования** данных API (мемориалы, компании, товары)
- **Счетчиков** (просмотры, лайки)
- **Сессий** пользователей
- **Rate limiting** (ограничение запросов)

**Производительность:** ответы API ускоряются на 90-97% при использовании кэша!

---

## 🐧 Установка Redis на Linux (Ubuntu/Debian)

```bash
# Установка Redis
sudo apt update
sudo apt install redis-server -y

# Запуск Redis
sudo systemctl start redis-server

# Автозапуск при старте системы
sudo systemctl enable redis-server

# Проверка статуса
sudo systemctl status redis-server

# Проверка работы
redis-cli ping
# Должно вернуть: PONG
```

### Настройка Redis (опционально)

```bash
# Редактируем конфигурацию
sudo nano /etc/redis/redis.conf

# Важные настройки:
# maxmemory 256mb                    # Максимум памяти
# maxmemory-policy allkeys-lru       # Политика вытеснения
# bind 127.0.0.1                     # Только локальные подключения
# requirepass your_password          # Пароль (раскомментируйте)

# Перезапуск после изменений
sudo systemctl restart redis-server
```

---

## 🍎 Установка Redis на macOS

### Через Homebrew (рекомендуется)

```bash
# Установка Homebrew (если нет)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Установка Redis
brew install redis

# Запуск Redis
brew services start redis

# Или запуск вручную
redis-server /usr/local/etc/redis.conf

# Проверка
redis-cli ping
# Должно вернуть: PONG
```

### Через MacPorts

```bash
sudo port install redis
sudo port load redis
```

---

## 🪟 Установка Redis на Windows

### Вариант 1: WSL (Windows Subsystem for Linux) - рекомендуется

```bash
# Установите WSL
wsl --install

# В WSL установите Redis как на Linux
sudo apt update
sudo apt install redis-server -y
sudo service redis-server start

# Проверка
redis-cli ping
```

### Вариант 2: Redis для Windows (старая версия)

```bash
# Скачайте с GitHub
# https://github.com/microsoftarchive/redis/releases

# Или через Chocolatey
choco install redis-64

# Запуск
redis-server
```

### Вариант 3: Docker (универсальный способ)

```bash
# Установите Docker Desktop
# https://www.docker.com/products/docker-desktop

# Запуск Redis в Docker
docker run -d -p 6379:6379 --name lapida-redis redis:alpine

# Проверка
docker exec -it lapida-redis redis-cli ping
```

---

## 🐳 Установка через Docker (рекомендуется для всех ОС)

### docker-compose.yml

Создайте файл `docker-compose.redis.yml` в корне проекта:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: lapida-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

volumes:
  redis-data:
```

### Запуск

```bash
# Запуск Redis
docker-compose -f docker-compose.redis.yml up -d

# Проверка логов
docker-compose -f docker-compose.redis.yml logs -f

# Остановка
docker-compose -f docker-compose.redis.yml down

# Остановка с удалением данных
docker-compose -f docker-compose.redis.yml down -v
```

---

## ⚙️ Настройка проекта

### 1. Создайте .env файл

```bash
cd server
cp .env.example .env
```

### 2. Настройте переменные окружения

Отредактируйте `server/.env`:

```env
# Redis настройки
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=            # Оставьте пустым если без пароля
REDIS_DB=0

# Для Docker Desktop на Windows/Mac
# REDIS_HOST=host.docker.internal

# Для production с паролем
# REDIS_PASSWORD=your_secure_password
```

### 3. Установите зависимости (если еще не установлены)

```bash
cd server
npm install
```

### 4. Запустите сервер

```bash
npm start
# или
npm run dev
```

### Ожидаемый вывод

```
✅ Конфигурация: { nodeEnv: 'development', hasMongoUri: true, hasJwtSecret: true }
✅ MongoDB подключена успешно
📊 Создание индексов MongoDB...
  ✅ Users индексы созданы
  ✅ Memorials индексы созданы
  ✅ Companies индексы созданы
  ...
✅ Все индексы успешно созданы!
✅ Redis подключен
✅ Redis готов к использованию

==================================================
🚀 Сервер запущен на порту 10000
📅 Режим: development
🌐 URL: http://localhost:10000
==================================================
```

---

## 🧪 Проверка работы Redis

### Через Redis CLI

```bash
# Подключение к Redis
redis-cli

# Основные команды
127.0.0.1:6379> PING
PONG

127.0.0.1:6379> SET test "Hello Redis"
OK

127.0.0.1:6379> GET test
"Hello Redis"

127.0.0.1:6379> KEYS *
1) "test"

127.0.0.1:6379> DEL test
(integer) 1

127.0.0.1:6379> EXIT
```

### Через API проекта

```bash
# Первый запрос - кэш создается
curl http://localhost:10000/api/memorials
# Ответ: обычная скорость (~500ms)

# Второй запрос - из кэша
curl http://localhost:10000/api/memorials
# Ответ: очень быстро (~20ms) + "_cached": true
```

### Мониторинг кэша

```bash
# Смотрим все ключи кэша
redis-cli KEYS "cache:*"

# Смотрим статистику
redis-cli INFO stats

# Количество ключей
redis-cli DBSIZE

# Очистить весь кэш (осторожно!)
redis-cli FLUSHDB
```

---

## 🚨 Troubleshooting

### Ошибка: "Redis connection refused"

**Проблема:** Redis не запущен

**Решение:**
```bash
# Linux
sudo systemctl start redis-server

# macOS
brew services start redis

# Docker
docker-compose -f docker-compose.redis.yml up -d
```

### Ошибка: "NOAUTH Authentication required"

**Проблема:** Redis требует пароль

**Решение:** Добавьте пароль в `.env`:
```env
REDIS_PASSWORD=your_password
```

### Redis работает, но кэш не создается

**Проверка:**
```bash
# Убедитесь что Redis доступен
redis-cli ping

# Проверьте логи сервера
# Должно быть: "✅ Redis готов к использованию"

# Проверьте первый запрос к API
curl -v http://localhost:10000/api/memorials
# В ответе не должно быть "_cached": true

# Второй запрос должен быть с кэшем
curl -v http://localhost:10000/api/memorials
# В ответе: "_cached": true
```

### Проект работает без Redis

Это нормально! Redis **опциональный**. Если Redis недоступен:
- Сервер запустится с предупреждением: "⚠️ Redis недоступен, кэширование отключено"
- Все функции работают, но без кэширования
- Производительность ниже (~500-800ms вместо 20-50ms)

---

## 📊 Мониторинг производительности

### Простой тест

```bash
# Без кэша (первый запрос)
time curl http://localhost:10000/api/memorials > /dev/null

# С кэшем (второй запрос)
time curl http://localhost:10000/api/memorials > /dev/null
```

### Нагрузочное тестирование

```bash
# Установите Apache Bench
sudo apt install apache2-utils  # Linux
brew install apache2-utils       # macOS

# Тест без кэша
ab -n 100 -c 10 http://localhost:10000/api/health

# Тест с кэшем
ab -n 100 -c 10 http://localhost:10000/api/memorials
```

---

## 🔐 Production настройки

### Redis с паролем

```bash
# /etc/redis/redis.conf
requirepass your_very_strong_password

# .env
REDIS_PASSWORD=your_very_strong_password
```

### Redis на отдельном сервере

```env
# .env
REDIS_HOST=redis.example.com
REDIS_PORT=6379
REDIS_PASSWORD=your_password
```

### Redis Cluster (масштабирование)

Для высоконагруженных проектов используйте Redis Cluster или Sentinel.

---

## 📚 Полезные ссылки

- [Redis документация](https://redis.io/docs/)
- [ioredis GitHub](https://github.com/luin/ioredis)
- [Redis GUI клиенты](https://redis.io/resources/tools/)
  - Redis Insight (рекомендуется)
  - RedisDesktopManager
  - Medis (macOS)

---

## ✅ Checklist

- [ ] Redis установлен и запущен
- [ ] `redis-cli ping` возвращает PONG
- [ ] Файл `.env` создан и настроен
- [ ] Сервер запускается без ошибок
- [ ] В логах: "✅ Redis готов к использованию"
- [ ] Кэш работает (второй запрос быстрее)
- [ ] `redis-cli KEYS "cache:*"` показывает ключи

---

**Готово!** Теперь ваш проект работает с Redis кэшированием! 🚀
