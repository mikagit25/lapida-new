const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const envPath = path.join(__dirname, '.env');
require('dotenv').config({ path: envPath });

// Ensure SESSION_SECRET exists (avoid startup warnings in dev/test)
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = crypto.randomBytes(32).toString('hex');
  console.warn('⚠️  SESSION_SECRET not set; generated ephemeral secret for this run');
}

if (process.env.NODE_ENV === 'development') {
  console.log('🔧 [DEV] Рабочая директория:', process.cwd());
  console.log('🔧 [DEV] __dirname:', __dirname);
  console.log('🔧 [DEV] .env path:', envPath);
  try {
    const envFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.env'));
    console.log('🔧 [DEV] .env файлы найдены:', envFiles.length);
  } catch (e) {
    console.log('⚠️  [DEV] Ошибка при чтении .env файлов:', e.message);
  }
}
const PORT = process.env.PORT || process.env.npm_config_port || process.env.npm_package_config_port || 10000;
const express = require('express');
const passport = require('./oauth');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const orgsRouter = require('./routes/orgs');
const orgServicesRouter = require('./routes/orgServices');
const orgLeadsRouter = require('./routes/orgLeads');

// CORS
const allowedOrigins = [
  'https://lapida.one',
  'https://www.lapida.one',
  'http://localhost:5182',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5183',
  'http://localhost:5184',
  'http://localhost:5185',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5182',
  'http://127.0.0.1:5183',
  'http://127.0.0.1:5184',
  'http://127.0.0.1:5185',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3002',
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
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-CSRF-Token'],
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
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-CSRF-Token'],
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
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'X-CSRF-Token'],
  optionsSuccessStatus: 200
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Security middleware
const { 
  apiLimiter, 
  authLimiter, 
  uploadLimiter, 
  helmetConfig, 
  mongoSanitizeConfig 
} = require('./middleware/security');

// Helmet для защиты заголовков
app.use(helmetConfig);

// Защита от NoSQL injection
app.use(mongoSanitizeConfig);

// Общий rate limiting для всех API
app.use('/api/', apiLimiter);

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

// CSRF токен endpoint
const { csrfProtection, getCsrfToken } = require('./middleware/csrf');
app.use(csrfProtection);
app.get('/api/csrf-token', getCsrfToken);

// Маршруты API
app.use(passport.initialize());
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/token', require('./routes/token'));
app.use('/api/pool', require('./routes/pool'));
app.use('/api/products', require('./routes/products'));
app.use('/api/memorials', require('./routes/memorials-new'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/orgs', orgsRouter);
app.use('/api/org-services', orgServicesRouter);
app.use('/api/org-leads', orgLeadsRouter);
// // app.use('/api/upload', require('./routes/uploadClean'));
let uploadRouter;
try {
  uploadRouter = require('./routes/upload2').default || require('./routes/upload2');
} catch (e) {
  console.error('UPLOAD ROUTE REQUIRE ERROR:', e);
  uploadRouter = (req, res, next) => res.status(500).json({ error: 'Upload route failed to load', details: e.message });
}
app.use('/api/upload', uploadLimiter, uploadRouter);
app.use('/api/photo-comments', require('./routes/photoComments'));
app.use('/api/religious-services', require('./routes/religiousServices'));
app.use('/api/religious-products', require('./routes/religiousProducts'));
app.use('/api/religious-galleries', require('./routes/religiousGalleries'));
app.use('/api/religious-schedules', require('./routes/religiousSchedules'));
app.use('/api/religious-events', require('./routes/religiousEvents'));
app.use('/api/religious-event-reports', require('./routes/religiousEventReports'));
app.use('/api/religious-news', require('./routes/religiousNews'));
app.use('/api/religious-team-members', require('./routes/religiousTeamMembers'));
app.use('/api/religious-documents', require('./routes/religiousDocuments'));
app.use('/api/religious-contacts', require('./routes/religiousContacts'));
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
app.use('/api/psychologist', require('./routes/psychologist'));
// const genealogyRouter = require('./routes/genealogy');
// app.use('/api/genealogy', genealogyRouter);
app.use('/api/timeline-events', require('./routes/timeline-events'));
app.use('/api/complaints', require('./routes/complaints'));
// app.use('/api/social', require('./routes/social'));
// app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin', require('./routes/admin'));
// app.use('/api/integrations', require('./routes/integrations'));
app.use('/api/religious-organizations', require('./routes/religiousOrganizations'));
app.use('/api/admin-paid', require('./routes/adminPaid'));
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
    // Безопасная диагностика: проверяем наличие важных переменных без вывода значений
    const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'SESSION_SECRET'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn('⚠️  Отсутствуют переменные окружения:', missingVars.join(', '));
    }
    
    console.log('✅ Конфигурация:', {
      nodeEnv: process.env.NODE_ENV || 'development',
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasSessionSecret: !!process.env.SESSION_SECRET
    });
    
    // Подключение к базе по переменной окружения
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db';
    await mongoose.connect(uri);
    console.log('✅ MongoDB подключена успешно');
  } catch (error) {
    console.error('❌ Ошибка подключения к MongoDB:', error.message);
    process.exit(1);
  }
};

// Запуск сервера
const startServer = async () => {
  try {
    // 1. Подключаем MongoDB
    await connectDB();
    
    // 2. Создаем индексы для оптимизации запросов
    try {
      const { createIndexes } = require('./config/indexes');
      await createIndexes();
    } catch (error) {
      console.warn('⚠️  Не удалось создать индексы:', error.message);
      // Не останавливаем сервер, если индексы не созданы
    }
    
    // 3. Инициализируем Redis (опционально)
    try {
      const { redis } = require('./config/redis');

      // Ждём готовности без повторных подключений
      const waitReady = () => new Promise((resolve, reject) => {
        if (!redis || typeof redis.on !== 'function') {
          return reject(new Error('redis client is not available'));
        }
        if (redis.status === 'ready') return resolve();
        const onReady = () => {
          cleanup();
          resolve();
        };
        const onError = (err) => {
          cleanup();
          reject(err);
        };
        const onEnd = () => {
          cleanup();
          reject(new Error('redis connection ended before ready'));
        };
        const cleanup = () => {
          redis.off('ready', onReady);
          redis.off('error', onError);
          redis.off('end', onEnd);
          redis.off('close', onEnd);
        };
        redis.on('ready', onReady);
        redis.on('error', onError);
        redis.on('end', onEnd);
        redis.on('close', onEnd);
      });

      // Если клиент в состояниях end/close/wait, инициируем connect; если connecting — просто ждём ready
      if (redis?.status && ['end', 'close', 'wait'].includes(redis.status) && typeof redis.connect === 'function') {
        await redis.connect();
      }

      await waitReady();
      await redis.ping();
      console.log('✅ Redis готов к использованию');
    } catch (error) {
      console.warn('⚠️  Redis недоступен, кэширование отключено:', error.message);
      // Продолжаем работу без Redis
    }
    
    // 4. Запускаем HTTP сервер
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(50)}`);
      console.log(`🚀 Сервер запущен на порту ${PORT}`);
      console.log(`📅 Режим: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`${'='.repeat(50)}\n`);
    });
    
  } catch (error) {
    console.error('❌ Критическая ошибка при запуске сервера:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

// Экспортируем app для тестов
module.exports = app;