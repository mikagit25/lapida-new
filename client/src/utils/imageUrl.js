import { API_BASE_URL } from '../config/api-universal';

// Асинхронная версия fixImageUrl
export async function fixImageUrl(url) {
  if (!url) return url;
  // Получаем базовый адрес сервера без /api
  const apiBase = API_BASE_URL;
  const apiUrl = new URL(apiBase);
  const serverBase = `${apiUrl.protocol}//${apiUrl.hostname}`;

  // Абсолютный URL (http/https)
  if (/^https?:\//.test(url)) {
    return url;
  }
  // Если начинается с /upload/ или /uploads/ — всегда возвращаем serverBase + url
  if (url.startsWith('/upload/') || url.startsWith('/uploads/')) {
    return `${serverBase}${url}`;
  }
  // Если начинается с / — добавляем serverBase
  if (url.startsWith('/')) {
    return `${serverBase}${url}`;
  }
  // Если это просто имя файла (без слеша и http) — кладём в upload/memorials
  if (!url.includes('/') && !url.includes('http')) {
    return `${serverBase}/upload/memorials/${url}`;
  }
  return url;
}
// ...existing code...
