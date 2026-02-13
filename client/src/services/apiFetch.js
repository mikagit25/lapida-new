// Универсальная обёртка для fetch с автоматическим добавлением Authorization
export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  return fetch(url, { ...options, headers });
}
