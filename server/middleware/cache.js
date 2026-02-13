const { cacheUtils } = require('../config/redis');

/**
 * Middleware для кэширования GET запросов
 * @param {number} ttl - время жизни кэша в секундах (по умолчанию 5 минут)
 * @param {function} keyGenerator - функция генерации ключа кэша
 * @returns {function} Express middleware
 */
const cacheMiddleware = (ttl = 300, keyGenerator = null) => {
  return async (req, res, next) => {
    // Кэшируем только GET запросы
    if (req.method !== 'GET') {
      return next();
    }

    // Генерация ключа кэша
    const cacheKey = keyGenerator 
      ? keyGenerator(req) 
      : `cache:${req.originalUrl || req.url}`;

    try {
      // Проверяем кэш
      const cachedData = await cacheUtils.get(cacheKey);
      
      if (cachedData) {
        console.log(`🔷 Cache HIT: ${cacheKey}`);
        return res.json({
          ...cachedData,
          _cached: true,
          _cacheKey: cacheKey
        });
      }

      console.log(`🔶 Cache MISS: ${cacheKey}`);

      // Перехватываем оригинальный res.json
      const originalJson = res.json.bind(res);
      
      res.json = (data) => {
        // Сохраняем в кэш только успешные ответы
        if (res.statusCode >= 200 && res.statusCode < 300) {
          cacheUtils.set(cacheKey, data, ttl).catch(err => {
            console.error('Cache set error:', err.message);
          });
        }
        
        return originalJson(data);
      };

      next();
    } catch (error) {
      console.error('Cache middleware error:', error.message);
      // Если ошибка кэша, продолжаем без кэширования
      next();
    }
  };
};

/**
 * Middleware для инвалидации кэша
 * @param {string|string[]|function} patterns - паттерны ключей для удаления или функция генерации паттернов
 * @returns {function} Express middleware
 */
const invalidateCache = (patterns) => {
  return async (req, res, next) => {
    // Выполняем следующий middleware/handler
    const originalJson = res.json.bind(res);
    
    res.json = async (data) => {
      // Инвалидируем кэш только для успешных операций изменения данных
      if (res.statusCode >= 200 && res.statusCode < 300 && 
          ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        
        try {
          let patternsToDelete = [];
          
          if (typeof patterns === 'function') {
            patternsToDelete = patterns(req, data);
          } else if (Array.isArray(patterns)) {
            patternsToDelete = patterns;
          } else {
            patternsToDelete = [patterns];
          }

          for (const pattern of patternsToDelete) {
            const deletedCount = await cacheUtils.delPattern(pattern);
            if (deletedCount > 0) {
              console.log(`🗑️  Invalidated ${deletedCount} cache keys: ${pattern}`);
            }
          }
        } catch (error) {
          console.error('Cache invalidation error:', error.message);
        }
      }
      
      return originalJson(data);
    };

    next();
  };
};

/**
 * Генераторы ключей кэша для разных сущностей
 */
const cacheKeys = {
  // Мемориалы
  memorial: (id) => `cache:memorial:${id}`,
  memorials: (query) => `cache:memorials:${JSON.stringify(query)}`,
  memorialsList: () => 'cache:memorials:*',
  
  // Компании
  company: (id) => `cache:company:${id}`,
  companyBySlug: (slug) => `cache:company:slug:${slug}`,
  companies: (query) => `cache:companies:${JSON.stringify(query)}`,
  companiesList: () => 'cache:companies:*',
  
  // Товары
  product: (id) => `cache:product:${id}`,
  products: (companyId) => `cache:products:company:${companyId}`,
  productsList: () => 'cache:products:*',
  
  // Заказы
  order: (id) => `cache:order:${id}`,
  orders: (userId) => `cache:orders:user:${userId}`,
  ordersList: () => 'cache:orders:*',
  
  // Пользователи
  user: (id) => `cache:user:${id}`,
  usersList: () => 'cache:users:*',
  
  // Комментарии
  comments: (memorialId) => `cache:comments:memorial:${memorialId}`,
  commentsList: () => 'cache:comments:*',
};

module.exports = {
  cacheMiddleware,
  invalidateCache,
  cacheKeys,
  cacheUtils,
};
