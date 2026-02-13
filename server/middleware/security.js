const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Rate limiting для API
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
// Авторизованные запросы (Bearer или cookie token) не должны упираться в базовый rate limit
const isAuthedRequest = (req) => (
  (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) ||
  (req.cookies && req.cookies.token)
);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: isTest ? 50 : isProd ? 500 : 5000, // в тестах нужна сработка 429
  message: 'Слишком много запросов с этого IP, попробуйте позже',
  standardHeaders: true,
  legacyHeaders: false,
  skip: isAuthedRequest,
});

// Строгий rate limiting для аутентификации
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: isTest ? 1000 : 5, // в тестах не мешаем сценариям регистрации/логина
  message: 'Слишком много попыток входа, попробуйте через 15 минут',
  skipSuccessfulRequests: true,
  skip: () => isTest || process.env.DISABLE_RATE_LIMITING === 'true'
});

// Rate limiting для загрузки файлов
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: isTest ? 20 : isProd ? 200 : 2000,
  message: 'Слишком много загрузок, попробуйте через час',
  skip: isAuthedRequest,
});

// Helmet настройки для защиты заголовков
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

// Mongo sanitize - защита от NoSQL injection
const mongoSanitizeConfig = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  [Security] Обнаружена попытка NoSQL injection: ${key}`);
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  helmetConfig,
  mongoSanitizeConfig,
};
