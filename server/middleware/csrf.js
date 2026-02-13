// CSRF защита - современный подход без устаревших пакетов
// Использует double submit cookie pattern

const crypto = require('crypto');

// Генерация CSRF токена
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const isTest = process.env.NODE_ENV === 'test';

// Middleware для генерации CSRF токена
const csrfProtection = (req, res, next) => {
  // В тестах сохраняем генерацию токена, но пропускаем проверку
  if (req.method === 'GET') {
    const token = generateCsrfToken();
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false,
      secure: isSecure,
      sameSite: isSecure ? 'none' : 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000
    });
    req.csrfToken = token;
  }

  if (isTest) {
    return next();
  }
  // Для GET запросов генерируем новый токен
  if (req.method === 'GET') {
    const token = generateCsrfToken();
    // Устанавливаем токен в cookie. В dev оставляем secure=false и sameSite=lax,
    // иначе на http://localhost токен не уезжает в браузер.
    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';
    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false, // нужен фронту
      secure: isSecure,
      sameSite: isSecure ? 'none' : 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000 // 24 часа
    });
    req.csrfToken = token;
  }
  
  // Для POST, PUT, PATCH, DELETE проверяем токен
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    // Если клиент уже прошёл Bearer auth, CSRF менее критичен для API — пропускаем
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      return next();
    }

    // Исключаем некоторые маршруты (например, OAuth callback)
    const excludedPaths = ['/api/auth/google', '/api/auth/facebook', '/api/auth/apple'];
    if (excludedPaths.some(path => req.path.includes(path))) {
      return next();
    }
    
    const cookieToken = req.cookies['XSRF-TOKEN'];
    const headerToken = req.headers['x-csrf-token'] || req.headers['x-xsrf-token'];
    
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      console.warn(`⚠️  [Security] CSRF токен недействителен: ${req.method} ${req.path}`);
      return res.status(403).json({
        success: false,
        message: 'Недействительный CSRF токен'
      });
    }
  }
  
  next();
};

// API endpoint для получения CSRF токена
const getCsrfToken = (req, res) => {
  res.json({
    success: true,
    token: req.csrfToken
  });
};

module.exports = {
  csrfProtection,
  getCsrfToken
};
