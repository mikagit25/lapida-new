import { getApiBaseUrl } from '../config/api';

// Асинхронная версия fixImageUrl
export async function fixImageUrl(url) {
  if (!url) return url;
  // Получаем базовый адрес сервера без /api
  let serverBase = window.location.origin;
  try {
    const apiBase = await getApiBaseUrl();
    const apiUrl = new URL(apiBase);
    serverBase = `${apiUrl.protocol}//${apiUrl.hostname}${apiUrl.port ? ':' + apiUrl.port : ''}`;
  } catch (e) { /* ignore */ }

  // Абсолютный URL (http/https)
  if (/^https?:\//.test(url)) {
    try {
      const img = new URL(url);
      if ((img.hostname === 'localhost' || img.hostname === '127.0.0.1') && serverBase) {
        return `${serverBase}${img.pathname}${img.search || ''}`;
      }
    } catch (e) { /* ignore */ }
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
