// ...existing code...
const express = require('express');


const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || process.env.npm_config_port || process.env.npm_package_config_port || (process.env.NODE_ENV === 'production' ? 80 : 5005);
const app = express();
const cookieParser = require('cookie-parser');

// 1. CORS
// Универсальный CORS с whitelist
const allowedOrigins = [
  'http://localhost:5182', // локальный фронт
  'http://localhost:3000', // запасной фронт
  'https://lapida.ru',     // продакшн
  'https://admin.lapida.ru' // админка
];
app.use(cors({
  origin: function(origin, callback) {
    // Разрешить запросы без origin (например, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
}));

// Подключение cookie-parser для работы с cookie
app.use(cookieParser());

// Уникальный healthcheck для универсального поиска API
app.get('/api/health', (req, res) => {
  res.json({ app: 'lapida', status: 'ok' });
});


// ====== КЛАССИЧЕСКИЙ ПОРЯДОК MIDDLEWARE ======
// 1. CORS
app.use(cors({
  origin: true, // разрешить любые origins
  credentials: true
}));

// 2. JSON и формы
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Логирование
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// 4. СТАТИКА (upload и public)

// Отдача статики для пользовательской галереи и мемориалов
app.use('/upload/gallery', express.static(path.join(__dirname, 'upload/gallery')));
app.use('/upload/memorials', express.static(path.join(__dirname, 'upload/memorials')));
// Общий доступ ко всем upload (гарантированно работает для /upload/graves/...)
app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use(express.static(path.join(__dirname, 'public')));

// Подключение к базе данных MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db');
    console.log('MongoDB подключена успешно');
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
    process.exit(1);
  }
};

// Маршруты
app.get('/', (req, res) => {
  res.json({ message: 'Lapida API запущен' });
});

// Health check endpoint для автоматического обнаружения сервера
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});


// Маршруты API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/memorials', require('./routes/memorials-new'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/upload', require('./routes/uploadClean'));
app.use('/api/photo-comments', require('./routes/photoComments'));
app.use('/api/photo-comments-simple', require('./routes/photoCommentsSimple'));
app.use('/api/timeline', require('./routes/timeline'));
app.use('/api/virtual', require('./routes/virtual'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/gallery-recovery', require('./routes/galleryRecovery'));



// Глобальный обработчик ошибок (после всех роутов и статики)
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  // Если ошибка связана с раздачей статики — логируем путь
  if (req && req.originalUrl && req.originalUrl.startsWith('/api/upload')) {
    console.error('Static file error (api/upload):', req.originalUrl, err.message);
  }
  if (req && req.originalUrl && req.originalUrl.startsWith('/upload')) {
    console.error('Static file error (upload):', req.originalUrl, err.message);
  }
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
    stack: err.stack
  });
});


// 404 обработчик
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});


// Запуск сервера
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
};

startServer();
