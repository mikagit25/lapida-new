module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'middleware/**/*.js',
    'routes/**/*.js',
    'models/**/*.js',
    'config/**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/*.test.js',
    '!**/*.spec.js'
  ],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/*.test.js',
    '**/*.spec.js'
  ],
  // Раньше интеграционные тесты игнорировались, теперь включаем их чтобы ловить регрессии API
  testPathIgnorePatterns: [],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0
    }
  },
  verbose: true,
  testTimeout: 30000,
  forceExit: true,
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};
