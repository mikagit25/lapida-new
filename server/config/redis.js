const Redis = require('ioredis');

// Позволяем отключить Redis целиком, чтобы не мешал разработке
const redisDisabled = process.env.REDIS_DISABLE === '1';
const isProd = process.env.NODE_ENV === 'production';

const createStub = () => ({
  async ping() { return 'PONG'; },
  async get() { return null; },
  async setex() { return 'OK'; },
  async del() { return 1; },
  async keys() { return []; },
  async exists() { return 0; },
  async incr() { return 1; },
  async expire() { return 1; },
  async ttl() { return -2; },
  on() {},
  quit: async () => {},
});

// Конфигурация Redis
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  db: process.env.REDIS_DB || 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  // Разрешаем очередь команд до готовности подключения, чтобы старты с ping не сыпали ошибками
  enableOfflineQueue: true,
  maxRetriesPerRequest: 3,
};

let redis;

if (redisDisabled) {
  console.warn('⚠️  Redis отключён через REDIS_DISABLE=1');
  redis = createStub();
} else {
  // Создание клиента Redis
  redis = new Redis(redisConfig);

  let connected = false;
  let fallbackArmed = false;

  // Обработка событий подключения
  redis.on('connect', () => {
    connected = true;
    console.log('✅ Redis подключен');
  });

  const switchToStub = (reason) => {
    if (fallbackArmed) return;
    fallbackArmed = true;
    console.warn('⚠️  Redis недоступен, переключаем кэш на заглушку:', reason);
    try { redis.disconnect(); } catch (_) {}
    redis = createStub();
  };

  redis.on('error', (err) => {
    // В production продолжаем пытаться коннектиться, в dev — переключаемся
    if (!isProd && !connected) {
      switchToStub(err.message || 'unknown');
      return;
    }
    console.error('❌ Redis ошибка:', err.message);
  });

  redis.on('close', () => {
    console.log('⚠️  Redis соединение закрыто');
    if (!isProd && !connected) {
      switchToStub('closed before connect');
    }
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    try { await redis.quit(); } catch (_) {}
    console.log('Redis клиент закрыт');
  });
}

// Утилиты для работы с кэшем
const cacheUtils = {
  /**
   * Получить данные из кэша
   * @param {string} key - ключ
   * @returns {Promise<any|null>}
   */
  async get(key) {
    try {
      const cached = await redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Redis get error:', error.message);
      return null;
    }
  },

  /**
   * Сохранить данные в кэш
   * @param {string} key - ключ
   * @param {any} value - значение
   * @param {number} ttl - время жизни в секундах (по умолчанию 1 час)
   * @returns {Promise<boolean>}
   */
  async set(key, value, ttl = 3600) {
    try {
      await redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Redis set error:', error.message);
      return false;
    }
  },

  /**
   * Удалить данные из кэша
   * @param {string} key - ключ или массив ключей
   * @returns {Promise<boolean>}
   */
  async del(key) {
    try {
      await redis.del(key);
      return true;
    } catch (error) {
      console.error('Redis del error:', error.message);
      return false;
    }
  },

  /**
   * Удалить все ключи по паттерну
   * @param {string} pattern - паттерн (например: 'user:*')
   * @returns {Promise<number>}
   */
  async delPattern(pattern) {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
        return keys.length;
      }
      return 0;
    } catch (error) {
      console.error('Redis delPattern error:', error.message);
      return 0;
    }
  },

  /**
   * Проверить существование ключа
   * @param {string} key - ключ
   * @returns {Promise<boolean>}
   */
  async exists(key) {
    try {
      const result = await redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error('Redis exists error:', error.message);
      return false;
    }
  },

  /**
   * Увеличить счетчик
   * @param {string} key - ключ
   * @param {number} ttl - время жизни в секундах
   * @returns {Promise<number>}
   */
  async incr(key, ttl = 3600) {
    try {
      const value = await redis.incr(key);
      if (value === 1 && ttl) {
        await redis.expire(key, ttl);
      }
      return value;
    } catch (error) {
      console.error('Redis incr error:', error.message);
      return 0;
    }
  },

  /**
   * Получить TTL ключа
   * @param {string} key - ключ
   * @returns {Promise<number>} -2 если не существует, -1 если без TTL, иначе секунды
   */
  async ttl(key) {
    try {
      return await redis.ttl(key);
    } catch (error) {
      console.error('Redis ttl error:', error.message);
      return -2;
    }
  },
};

module.exports = {
  redis,
  cacheUtils,
};
