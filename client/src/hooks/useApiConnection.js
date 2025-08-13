import { useState, useEffect } from 'react';
import { API_BASE_URL, findWorkingApiUrl } from '../config/api-universal';

/**
 * Хук для автоматического поиска и подключения к доступному API серверу
 */
export function useApiConnection() {
    const [apiUrl, setApiUrl] = useState(API_BASE_URL);
    const [isConnected, setIsConnected] = useState(false);
    const [isSearching, setIsSearching] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        async function findAndTestApi() {
            console.log('🔍 Поиск доступного API сервера...');
            setIsSearching(true);
            setError(null);

            try {
                // Сначала пробуем базовый URL
                const testResponse = await fetch(`${API_BASE_URL}/api/health`, {
                    method: 'GET',
                    timeout: 3000
                });

                if (testResponse.ok && mounted) {
                    console.log('✅ Базовый API URL работает:', API_BASE_URL);
                    setApiUrl(API_BASE_URL);
                    setIsConnected(true);
                    setIsSearching(false);
                    return;
                }
            } catch (error) {
                console.log('❌ Базовый API URL недоступен, ищем альтернативы...');
            }

            try {
                // Если базовый не работает, ищем альтернативы
                const workingUrl = await findWorkingApiUrl();
                
                if (mounted) {
                    if (workingUrl !== API_BASE_URL) {
                        console.log('🔄 Переключение на работающий API:', workingUrl);
                        setApiUrl(workingUrl);
                    }
                    setIsConnected(true);
                    setIsSearching(false);
                }
            } catch (error) {
                if (mounted) {
                    console.error('❌ Не удалось найти работающий API сервер:', error);
                    setError('Сервер недоступен. Проверьте, запущен ли backend.');
                    setIsConnected(false);
                    setIsSearching(false);
                }
            }
        }

        findAndTestApi();

        // Периодическая проверка соединения
        const interval = setInterval(async () => {
            if (!mounted) return;

            try {
                const response = await fetch(`${apiUrl}/api/health`, {
                    method: 'GET',
                    timeout: 5000
                });

                if (response.ok) {
                    if (!isConnected) {
                        setIsConnected(true);
                        setError(null);
                        console.log('✅ Соединение с API восстановлено');
                    }
                } else {
                    throw new Error('Health check failed');
                }
            } catch (error) {
                if (isConnected) {
                    setIsConnected(false);
                    setError('Потеряно соединение с сервером');
                    console.log('❌ Потеряно соединение с API');
                }
            }
        }, 30000); // Проверяем каждые 30 секунд

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, [apiUrl, isConnected]);

    return {
        apiUrl,
        isConnected,
        isSearching,
        error,
        retryConnection: () => {
            setIsSearching(true);
            setError(null);
            // Перезапуск useEffect
            setApiUrl(API_BASE_URL);
        }
    };
}

export default useApiConnection;
