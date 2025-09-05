
// Автоматический выбор API URL в зависимости от окружения
let API_BASE_URL = 'https://lapida.one/api';
if (typeof window !== 'undefined' && window.location && window.location.hostname && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
	API_BASE_URL = 'http://localhost:5005/api';
}

export { API_BASE_URL };
