/**
 * Универсальная конфигурация API
 * Автоматически определяет правильный URL API в любых условиях
 */

// Функция для определения базового URL API
function getApiBaseUrl() {
    // Универсальная логика: если клиент на 3000, API на 5002, иначе /api на текущем origin
    // Всегда используем origin + '/api', независимо от порта и переменных окружения
    const origin = window.location.origin;
    const apiUrl = origin + '/api';
    console.log('🌍 Универсальный API URL:', apiUrl);
    return apiUrl;
}

// Основной API URL
export const API_BASE_URL = getApiBaseUrl();

// Функция для проверки доступности API и автоматического переключения портов
export async function findWorkingApiUrl() {
    // Кэшируем найденный рабочий API URL
    if (window.__cachedWorkingApiUrl) {
        // Проверяем, не было ли ошибки 500 на последнем запросе
        try {
            const testUrl = window.__cachedWorkingApiUrl.replace(/\/api$/, '');
            const response = await fetch(`${testUrl}/api/health`, { method: 'GET', timeout: 2000 });
            if (response.ok) {
                return window.__cachedWorkingApiUrl;
            } else if (response.status === 500) {
                // Ошибка 500 — сбрасываем кэш
                window.__cachedWorkingApiUrl = null;
            }
        } catch (e) {
            window.__cachedWorkingApiUrl = null;
        }
    }

    const currentHost = window.location.hostname;
    const currentProtocol = window.location.protocol;
    // Пробуем 5005 первым, остальные порты после
    const portsToTry = [5005, 5184, 3000, 5007, 8000, 5000, 4000, 8080, 9000];
    console.log('🔍 Поиск работающего API сервера...');
    for (const port of portsToTry) {
        const testUrl = `${currentProtocol}//${currentHost}:${port}`;
        try {
            const response = await fetch(`${testUrl}/api/health`, {
                method: 'GET',
                timeout: 2000
            });
            if (response.ok) {
                const json = await response.json();
                if (json && json.app === 'lapida') {
                    console.log(`✅ Найден работающий API сервер: ${testUrl}/api`);
                    window.__cachedWorkingApiUrl = `${testUrl}/api`;
                    return `${testUrl}/api`;
                } else {
                    console.log(`⚠️ Порт ${port} отвечает, но не lapida:`, json);
                }
            }
        } catch (error) {
            console.log(`❌ Порт ${port} недоступен`);
        }
    }
    console.log('⚠️ Работающий API сервер не найден, используем базовый URL');
    window.__cachedWorkingApiUrl = API_BASE_URL;
    return API_BASE_URL;
}

// Экспорт для обратной совместимости
export default API_BASE_URL;

// Логируем конфигурацию при загрузке модуля
console.log('🎯 Конфигурация API инициализирована');
console.log('📍 Базовый API URL:', API_BASE_URL);
console.log('🌍 Окружение:', import.meta.env.MODE);
