// Setup для тестов
// Загружаем переменные окружения из тестового .env
require('dotenv').config({ path: '.env.test' });

// Настройка таймаутов (интеграционные тесты иногда дольше из-за Mongo)
jest.setTimeout(30000);

// Глобальные моки и утилиты
global.console = {
  ...console,
  // Отключаем логи в тестах (оставляем только errors)
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error // Оставляем errors для отладки
};

// Хелперы для тестов
global.testHelpers = {
  // Генерация случайного email
  randomEmail: () => `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@example.com`,
  
  // Генерация случайного username
  randomUsername: () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  // Задержка
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Мок для JWT токена
  mockJWT: {
    userId: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    role: 'user'
  }
};
