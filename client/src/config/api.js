// Универсальный базовый адрес API с резервом для локальной разработки
export const API_BASE_URL = import.meta.env.VITE_API_URL
	|| (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:10000/api');

// Совместимость со старыми вызовами, ожидающими функцию
export async function getApiBaseUrl() {
	return API_BASE_URL;
}
