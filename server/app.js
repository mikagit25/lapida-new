const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '.env');
require('dotenv').config({ path: envPath });
console.log('--- DIAGNOSTICS ---');
console.log('process.cwd():', process.cwd());
console.log('__dirname:', __dirname);
console.log('.env path:', envPath);
console.log('MONGODB_URI:', process.env.MONGODB_URI);
try {
  const envFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.env'));
  console.log('Все .env файлы в папке server:', envFiles);
} catch (e) {
  console.log('Ошибка при чтении .env файлов:', e.message);
}
const PORT = process.env.PORT || process.env.npm_config_port || process.env.npm_package_config_port || 10000;
const express = require('express');
const passport = require('./oauth');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// CORS
const allowedOrigins = [
  'https://lapida.one',
  'https://www.lapida.one',
  'http://localhost:5182',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5182',
];
app.use(cors({
  origin: function(origin, callback) {
    console.log('[CORS] Запрос с origin:', origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn('[CORS] Отклонён origin:', origin);
      return callback(new Error('Not allowed by CORS: ' + origin), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
}));
app.options('*', cors({
  origin: function(origin, callback) {
    console.log('[CORS][OPTIONS] Запрос с origin:', origin);
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn('[CORS][OPTIONS] Отклонён origin:', origin);
      return callback(new Error('Not allowed by CORS: ' + origin), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  optionsSuccessStatus: 200
}));

// Подключение роутов только после CORS!
app.use('/api/user-connections', require('./routes/userConnections'));
app.use('/api/memorial-editors', require('./routes/memorialEditors'));
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
app.use('/upload/media', express.static(path.join(__dirname, 'upload/media')));
app.use('/upload', express.static(path.join(__dirname, 'upload')));
// Для изображений компаний, галерей и т.д. из server/public/uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

 
 // Фронтенд (React/Vite)
app.use(express.static(path.join(__dirname, '../client/dist')));
 // SPA fallback: отдаём index.html для всех не-API запросов
// Короткий адрес мемориала: lapida.one/(имя мемориала)
app.get('/:shareUrl', async (req, res, next) => {
  try {
    const Memorial = require('./models/Memorial');
    const memorial = await Memorial.findOne({ shareUrl: req.params.shareUrl });
    if (memorial) {
      // Отдаём SPA-фронтенд, который сам загрузит мемориал по shareUrl
      return res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
    // Если не найден — 404
    return res.status(404).send('Memorial not found');
  } catch (err) {
    next(err);
  }
});

// SPA fallback: отдаём index.html для всех не-API запросов
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

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

// Расширенный healthcheck для MongoDB
app.get('/api/health/db', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    let dbStatus = 'unknown';
    if (dbState === 0) dbStatus = 'disconnected';
    if (dbState === 1) dbStatus = 'connected';
    if (dbState === 2) dbStatus = 'connecting';
    if (dbState === 3) dbStatus = 'disconnecting';
    res.json({
      mongo: dbStatus,
      dbHost: mongoose.connection.host,
      dbName: mongoose.connection.name,
      dbUri: process.env.MONGODB_URI,
      nodeEnv: process.env.NODE_ENV,
      port: PORT
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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
// // app.use('/api/upload', require('./routes/uploadClean'));
let uploadRouter;
try {
  uploadRouter = require('./routes/upload2').default || require('./routes/upload2');
} catch (e) {
  console.error('UPLOAD ROUTE REQUIRE ERROR:', e);
  uploadRouter = (req, res, next) => res.status(500).json({ error: 'Upload route failed to load', details: e.message });
}
app.use('/api/upload', uploadRouter);
app.use('/api/photo-comments', require('./routes/photoComments'));
app.use('/api/memory-days', require('./routes/memoryDays'));
app.use('/api/support-groups', require('./routes/supportGroups'));
app.use('/api/photo-comments-simple', require('./routes/photoCommentsSimple'));
app.use('/api/timeline', require('./routes/timeline'));
app.use('/api/virtual', require('./routes/virtual'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/test', require('./routes/testRoute'));
app.use('/api/gallery-recovery', require('./routes/galleryRecovery'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/search', require('./routes/search'));
// const genealogyRouter = require('./routes/genealogy');
// app.use('/api/genealogy', genealogyRouter);
// app.use('/api/timeline-events', require('./routes/timeline-events'));
// app.use('/api/complaints', require('./routes/complaints'));
// app.use('/api/social', require('./routes/social'));
// app.use('/api/payments', require('./routes/payments'));
// app.use('/api/admin', require('./routes/admin'));
// app.use('/api/integrations', require('./routes/integrations'));
// app.use('/api/media', require('./routes/media'));

// Корневой маршрут
app.get('/', (req, res) => {
    // Корневой маршрут теперь отдаёт фронтенд через SPA fallback выше
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
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
    // Диагностика: выводим все секреты и переменные окружения, связанные с авторизацией
    console.log('MONGODB_URI:', process.env.MONGODB_URI);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('SESSION_SECRET:', process.env.SESSION_SECRET);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    // Можно добавить вывод других важных переменных:
    Object.keys(process.env).filter(k => k.toLowerCase().includes('secret') || k.toLowerCase().includes('jwt')).forEach(k => {
      console.log(`${k}:`, process.env[k]);
    });
    // Подключение к базе по переменной окружения
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db';
    await mongoose.connect(uri);
    console.log('MongoDB подключена успешно (URI из process.env)');
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