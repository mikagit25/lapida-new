# Система URL для lapida.one

## Обзор
Проект теперь поддерживает красивые URL для мемориалов в формате `lapida.one/имя-человека`, а также сохраняет обратную совместимость со старыми URL.

## Форматы URL

### Разработка (localhost)
- **Стандартный URL**: `http://localhost:5173/memorial/shareUrl`
- **Красивый URL**: `http://localhost:5173/customSlug`

### Продакшен (lapida.one)
- **Красивый URL**: `https://lapida.one/customSlug`
- **Стандартный URL**: `https://lapida.one/memorial/shareUrl` (fallback)

### Другие хостинги
- **Красивый URL**: `https://yourdomain.com/customSlug`
- **Стандартный URL**: `https://yourdomain.com/memorial/shareUrl` (fallback)

## Как это работает

### 1. Генерация customSlug
При создании мемориала система автоматически генерирует `customSlug` из полного имени:
- Конвертирует в нижний регистр
- Транслитерирует кириллицу в латиницу
- Заменяет пробелы на дефисы
- Удаляет специальные символы
- Проверяет уникальность

**Примеры:**
- "Иван Петров" → "ivan-petrov"
- "John Smith" → "john-smith"
- "Мария Сидорова" → "mariya-sidorova"

### 2. Маршрутизация
В `App.jsx` настроены два маршрута:
```jsx
<Route path="/memorial/:shareUrl" element={<MemorialView />} />
<Route path="/:slug" element={<MemorialView />} />
```

### 3. Компонент MemorialView
Автоматически определяет тип URL и загружает соответствующий мемориал:
- Если URL начинается с `/memorial/` → ищет по `shareUrl`
- Иначе → ищет по `customSlug`

### 4. Генерация ссылок
Все компоненты используют утилиты из `utils/memorialUrl.js`:

```javascript
import { getMemorialUrl, getMemorialShareUrl, getMemorialDisplayUrl } from '../utils/memorialUrl';

// Для навигации внутри приложения
const routerUrl = getMemorialUrl(memorial);

// Для внешних ссылок и соцсетей
const shareUrl = getMemorialShareUrl(memorial);

// Для отображения в интерфейсе
const displayUrl = getMemorialDisplayUrl(memorial);
```

## Компоненты с обновленными ссылками

1. **ShareBlock.jsx** - блок поделиться
2. **UserMemorials.jsx** - список мемориалов пользователя
3. **UserActivity.jsx** - активность пользователя
4. **Dashboard.jsx** - панель управления
5. **Memorials.jsx** - общий список мемориалов
6. **SearchResults.jsx** - результаты поиска
7. **MemorialCreate.jsx** - создание мемориала

## Обратная совместимость

Все старые URL продолжают работать:
- `lapida.one/memorial/old-share-url` → редирект на `lapida.one/custom-slug`
- Существующие ссылки в соцсетях остаются рабочими
- API не изменился

## Настройка для хостинга

### Переменные окружения
```env
VITE_API_URL=https://lapida.one/api  # Для продакшена
```

### Конфигурация сервера
Убедитесь, что веб-сервер настроен для SPA:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## Тестирование

1. **Локально**: все URL автоматически работают через localhost
2. **Продакшен**: URL формируются с доменом lapida.one
3. **Тест-страница**: `url-test.html` для проверки всех типов URL

## Обновление существующих мемориалов

Для добавления `customSlug` к существующим мемориалам:
```bash
cd server
node update-custom-slugs.js
```

## SEO преимущества

- ✅ Человекочитаемые URL
- ✅ Семантическая структура
- ✅ Лучше для социальных сетей
- ✅ Удобство запоминания
- ✅ Профессиональный вид

## Примеры URL

| Тип | Разработка | Продакшен |
|-----|------------|-----------|
| Красивый | `localhost:5173/ivan-petrov` | `lapida.one/ivan-petrov` |
| Стандартный | `localhost:5173/memorial/ivan-petrov-123` | `lapida.one/memorial/ivan-petrov-123` |
| Поделиться | `http://localhost:5173/ivan-petrov` | `https://lapida.one/ivan-petrov` |
| Отображение | `localhost:5173/ivan-petrov` | `lapida.one/ivan-petrov` |
