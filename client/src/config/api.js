// Конфигурация API
// Импортируем универсальную конфигурацию
import { findWorkingApiUrl } from './api-universal.js';

// Асинхронно получаем рабочий API_BASE_URL
export async function getApiBaseUrl() {
  const url = await findWorkingApiUrl();
  return url;
}
