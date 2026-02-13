# Руководство по безопасности проекта Lapida

## ✅ Реализованные меры безопасности

### 1. Rate Limiting (Ограничение частоты запросов)

**Установлено:**
- API общий: 100 запросов за 15 минут с одного IP
- Аутентификация: 5 попыток входа за 15 минут
- Загрузка файлов: 50 загрузок в час

**Как работает:**
```javascript
// В app.js автоматически применяется ко всем API маршрутам
app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/upload', uploadLimiter, uploadRouter);
```

**Настройка:** Файл `/server/middleware/security.js`

### 2. Защита заголовков (Helmet.js)

**Что защищает:**
- XSS атаки через Content-Security-Policy
- Clickjacking через X-Frame-Options
- MIME type sniffing через X-Content-Type-Options
- Информация о технологиях через X-Powered-By

**Настройка:**
```javascript
// Автоматически применяется ко всем запросам
app.use(helmetConfig);
```

### 3. Защита от NoSQL Injection

**Установлено:** `express-mongo-sanitize`

**Что делает:**
- Удаляет знаки `$` и `.` из пользовательских данных
- Защищает от инъекций типа `{"$gt": ""}`
- Логирует попытки атак

**Пример атаки (заблокирована):**
```json
// Попытка обойти аутентификацию
{
  "email": {"$gt": ""},
  "password": {"$gt": ""}
}
```

### 4. Валидация входных данных (Joi)

**Доступные схемы валидации:**
- `registerSchema` - регистрация пользователя
- `loginSchema` - вход
- `memorialSchema` - создание мемориала
- `orderSchema` - создание заказа
- `companySchema` - создание компании
- `productSchema` - создание товара
- `commentSchema` - комментарии

**Как использовать в роутах:**

```javascript
// Пример в routes/auth.js
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

// Регистрация с валидацией
router.post('/register', validate(registerSchema), async (req, res) => {
  // Данные уже провалидированы
  const { username, email, password } = req.body;
  // ... логика регистрации
});

// Вход с валидацией
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  // ... логика входа
});
```

**Пример ошибки валидации:**
```json
{
  "success": false,
  "message": "Ошибка валидации данных",
  "errors": [
    {
      "field": "email",
      "message": "Некорректный email адрес"
    },
    {
      "field": "password",
      "message": "Пароль должен быть не менее 6 символов"
    }
  ]
}
```

### 5. CSRF защита (Cross-Site Request Forgery)

**Модель:** Double Submit Cookie Pattern

**Как использовать на фронтенде:**

```javascript
// 1. Получить CSRF токен при загрузке страницы
const getCsrfToken = async () => {
  const response = await fetch('/api/csrf-token');
  const data = await response.json();
  return data.token;
};

// 2. Добавить токен в заголовки всех запросов
const token = await getCsrfToken();

fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token
  },
  credentials: 'include', // Важно для отправки cookies
  body: JSON.stringify(orderData)
});
```

**Настройка в axios (рекомендуется):**

```javascript
// В главном файле приложения
import axios from 'axios';

// Получить токен из cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

// Автоматически добавлять CSRF токен ко всем запросам
axios.interceptors.request.use((config) => {
  const token = getCookie('XSRF-TOKEN');
  if (token) {
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});
```

### 6. Безопасное логирование

**Изменено:**
- ❌ Секреты больше не выводятся в консоль
- ✅ Только проверка наличия переменных окружения
- ✅ Маскировка чувствительных данных

**Пример безопасного лога:**
```javascript
console.log('✅ Конфигурация:', {
  nodeEnv: process.env.NODE_ENV,
  hasMongoUri: !!process.env.MONGODB_URI,
  hasJwtSecret: !!process.env.JWT_SECRET
});
// Вместо вывода реальных значений
```

## 🔐 Дополнительные рекомендации

### Переменные окружения (.env)

**Обязательно установите:**
```env
# Безопасность
JWT_SECRET=ваш_очень_длинный_случайный_секрет_минимум_32_символа
SESSION_SECRET=другой_длинный_секрет

# База данных
MONGODB_URI=mongodb://localhost:27017/lapida_db

# Окружение
NODE_ENV=production
```

**Генерация секретов:**
```bash
# Linux/Mac
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### HTTPS в продакшене

**Обязательно используйте HTTPS** для:
- Защиты данных при передаче
- Работы secure cookies
- Предотвращения MITM атак

### CORS настройки

**Проверьте** список разрешенных origins в `app.js`:
```javascript
const allowedOrigins = [
  'https://lapida.one',
  'https://www.lapida.one',
  // Добавьте свои домены
];
```

### Регулярные обновления

```bash
# Проверка уязвимостей
npm audit

# Исправление уязвимостей
npm audit fix

# Обновление зависимостей
npm update
```

## 🚨 Что делать при атаке

1. **Проверьте логи** на наличие подозрительных запросов
2. **Измените все секреты** (JWT_SECRET, SESSION_SECRET)
3. **Сбросьте все активные сессии**
4. **Временно заблокируйте** подозрительные IP
5. **Увеличьте rate limits** для критичных endpoints
6. **Уведомите пользователей** если данные были скомпрометированы

## 📊 Мониторинг

Рекомендуется добавить:
- Логирование всех попыток аутентификации
- Алерты при превышении rate limits
- Мониторинг необычной активности
- Регулярные бэкапы базы данных

## 🔍 Проверка безопасности

**Тестирование:**
```bash
# SQL/NoSQL injection
curl -X POST http://localhost:10000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": {"$gt": ""}, "password": {"$gt": ""}}'

# Результат: Должна быть ошибка валидации или 400 Bad Request

# Rate limiting
for i in {1..10}; do
  curl http://localhost:10000/api/health
done

# Результат: После 5-10 запросов должен вернуться 429 Too Many Requests
```

## ✅ Чеклист безопасности

- [x] Rate limiting настроен
- [x] Helmet.js подключен
- [x] NoSQL injection защита
- [x] Валидация входных данных
- [x] CSRF защита реализована
- [x] Секреты не логируются
- [ ] HTTPS настроен (продакшн)
- [ ] Регулярные бэкапы
- [ ] Мониторинг логов
- [ ] Обновление зависимостей

---

**Важно:** Безопасность - это процесс, а не одноразовая настройка. Регулярно проверяйте и обновляйте защиту!
