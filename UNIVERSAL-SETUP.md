# 🚀 Универсальная система запуска Lapida

Создана полностью автоматическая система, которая адаптируется к любым условиям запуска - локальная разработка, хостинг, различные порты и окружения.

## 📋 Что включено

### 🔧 Автоматические скрипты запуска
- **`quick-start.ps1`** - Быстрый запуск с автоматической настройкой
- **`universal-start.ps1`** - Полная универсальная версия (в разработке)
- **`auto-start-new.ps1`** - Альтернативная версия с поиском портов

### 🌐 Универсальная конфигурация API
- **`client/src/config/api-universal.js`** - Умная система определения API URL
- **`client/src/hooks/useApiConnection.js`** - React хук для автоподключения к API
- **`client/src/components/ConnectionStatus.jsx`** - Индикатор состояния соединения

### 🏥 Health Check система
- **`/api/health`** endpoint на сервере для проверки доступности
- Автоматическое переключение между портами при недоступности

## 🎯 Способы запуска

### 1. Быстрый запуск (рекомендуется)
```powershell
.\quick-start.ps1 -Force
```

### 2. С указанием портов
```powershell
.\quick-start.ps1 -ServerPort 4000 -ClientPort 4001 -Force
```

### 3. Классический запуск
```powershell
.\start-both.ps1
```

## 🔍 Автоматические возможности

### 🌍 Определение окружения
- **Разработка**: localhost с автопоиском портов
- **Продакшен**: автоматическое определение домена хостинга
- **Docker**: поддержка контейнеризации

### 🔌 Умный поиск портов
Система автоматически проверяет порты в порядке приоритета:
1. `3000` (сервер), `3001` (клиент)
2. `5007` (сервер), `5182` (клиент) 
3. `8000`, `5000`, `4000`, `8080`, `9000`

### 📡 Автоподключение API
Клиент автоматически:
- Определяет правильный API URL
- Переключается между портами при недоступности
- Показывает статус соединения
- Периодически проверяет соединение

## 🛠️ Технические детали

### Переменные окружения
Автоматически создаются файлы:

**server/.env**
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/lapida_db
JWT_SECRET=your_jwt_secret_key_here
```

**client/.env.local**
```env
VITE_API_URL=http://localhost:3000
VITE_APP_ENV=development
```

### Health Check API
```json
GET /api/health
{
  "status": "ok",
  "timestamp": "2025-08-04T10:30:00.000Z",
  "port": 3000,
  "environment": "development"
}
```

## 🎨 Использование в коде

### Автоподключение к API
```javascript
import { useApiConnection } from './hooks/useApiConnection';

function App() {
    const { apiUrl, isConnected, error } = useApiConnection();
    
    if (!isConnected) {
        return <div>Подключение к серверу...</div>;
    }
    
    // Ваш код приложения
}
```

### Универсальная конфигурация
```javascript
import { API_BASE_URL } from './config/api-universal';

// API_BASE_URL автоматически определяется в зависимости от окружения
const response = await fetch(`${API_BASE_URL}/api/memorials`);
```

## 🚦 Индикатор соединения

Добавьте в ваш `App.jsx`:
```javascript
import ConnectionStatus from './components/ConnectionStatus';

function App() {
    return (
        <div>
            <ConnectionStatus />
            {/* Остальной код приложения */}
        </div>
    );
}
```

## 🎉 Результат

Теперь проект **полностью универсален**:
- ✅ Автоматически находит свободные порты
- ✅ Сам создает конфигурационные файлы  
- ✅ Умно определяет API сервер
- ✅ Работает на любом хостинге без изменений
- ✅ Показывает статус соединения
- ✅ Автоматически переподключается при сбоях

**Больше не нужно править код при каждом тестировании!** 🎯
