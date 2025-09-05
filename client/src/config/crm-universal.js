import { apiFetch } from '../services/apiFetch';
/**
 * Универсальный поиск рабочего CRM API
 * Автоматически определяет правильный URL CRM в любых условиях
 */

export async function findWorkingCrmUrl() {
    // Кэшируем найденный рабочий CRM URL
    if (window.__cachedWorkingCrmUrl) {
        try {
            const testUrl = window.__cachedWorkingCrmUrl.replace(/\/api\/v1$/, '');
            const response = await apiFetch(`${testUrl}/api/v1/Account`, { method: 'OPTIONS', timeout: 2000 });
            if (response.ok || response.status === 401 || response.status === 403) {
                return window.__cachedWorkingCrmUrl;
            }
        } catch (e) {
            window.__cachedWorkingCrmUrl = null;
        }
    }

    const currentHost = window.location.hostname;
    const currentProtocol = window.location.protocol;
    // Популярные порты для CRM
    // Используем только nginx-прокси порт 8081
    const portsToTry = [8081];
    console.log('🔍 Поиск рабочего CRM API...');
    for (const port of portsToTry) {
        const testUrl = `${currentProtocol}//${currentHost}:${port}`;
        try {
            const response = await apiFetch(`${testUrl}/api/v1/Account`, {
                method: 'OPTIONS',
                timeout: 2000
            });
            if (response.ok || response.status === 401 || response.status === 403) {
                console.log(`✅ Найден рабочий CRM API: ${testUrl}/api/v1`);
                window.__cachedWorkingCrmUrl = `${testUrl}/api/v1`;
                return `${testUrl}/api/v1`;
            }
        } catch (error) {
            console.log(`❌ Порт CRM ${port} недоступен`);
        }
    }
    console.log('⚠️ Рабочий CRM API не найден, используем стандартный URL');
    window.__cachedWorkingCrmUrl = `${currentProtocol}//${currentHost}:8080/api/v1`;
    return `${currentProtocol}//${currentHost}:8080/api/v1`;
}

export default findWorkingCrmUrl;
