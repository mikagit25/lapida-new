const express = require('express');
const passport = require('./oauth');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const PORT = process.env.PORT || process.env.npm_config_port || process.env.npm_package_config_port || (process.env.NODE_ENV === 'production' ? 80 : 5005);
const cookieParser = require('cookie-parser');

// CORS
const allowedOrigins = [
  'http://localhost:5182',
  'http://localhost:3000',
  'https://lapida.ru',
  'https://admin.lapida.ru'
];
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.options('*', cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Логирование
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Статика
app.use('/upload/gallery', express.static(path.join(__dirname, 'upload/gallery')));
app.use('/upload/memorials', express.static(path.join(__dirname, 'upload/memorials')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));
app.use(express.static(path.join(__dirname, 'public')));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'lapida',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Маршруты API
app.use(passport.initialize());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/memorials', require('./routes/memorials-new'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/uploadClean'));
app.use('/api/photo-comments', require('./routes/photoComments'));
app.use('/api/photo-comments-simple', require('./routes/photoCommentsSimple'));
app.use('/api/timeline', require('./routes/timeline'));
app.use('/api/virtual', require('./routes/virtual'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/gallery-recovery', require('./routes/galleryRecovery'));

// Корневой маршрут
app.get('/', (req, res) => {
  res.json({ message: 'Lapida API запущен' });
});

// 404 обработчик
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error('Express error:', err);
  if (req && req.originalUrl && req.originalUrl.startsWith('/api/upload')) {
    console.error('Static file error (api/upload):', req.originalUrl, err.message);
  }
  if (req && req.originalUrl && req.originalUrl.startsWith('/upload')) {
    console.error('Static file error (upload):', req.originalUrl, err.message);
  }
  if (req.headers.origin && allowedOrigins.includes(req.headers.origin)) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  }
  if (err.message && err.message.includes('CORS')) {
    return res.status(403).json({
      message: 'CORS Error',
      error: err.message
    });
  }
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
    stack: err.stack
  });
});

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

// Запуск сервера
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}