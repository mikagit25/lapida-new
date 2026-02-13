import { API_BASE_URL } from '../config/api-universal';

/**
 * Утилита для генерации правильных URL мемориалов
 */

export const getMemorialUrl = (memorial) => {
  // Если есть customSlug или shareUrl, используем короткий адрес
  if (memorial.customSlug) {
    return `/${memorial.customSlug}`;
  }
  if (memorial.shareUrl) {
    return `/${memorial.shareUrl}`;
  }
  // fallback на длинный адрес
  return `/memorial/${memorial._id}`;
};

const getBaseUrl = () => {
  // 1) Явный публичный URL из env
  const envBase = import.meta.env.VITE_PUBLIC_BASE_URL;
  if (envBase) return envBase.replace(/\/$/, '');

  // 2) Origin текущего окна — но если это localhost/127.*, подставляем прод-домен, чтобы QR в деве вёл на prod
  if (typeof window !== 'undefined' && window.location?.origin) {
    const origin = window.location.origin.replace(/\/$/, '');
    if (/^https?:\/\/(localhost|127\.)/i.test(origin)) {
      return 'https://lapida.one';
    }
    return origin;
  }

  // 3) Origin из API_BASE_URL
  try {
    const apiUrl = new URL(API_BASE_URL);
    return apiUrl.origin.replace(/\/$/, '');
  } catch {
    // 4) Жёсткий fallback
    return 'https://lapida.one';
  }
};

const buildUrl = (memorial) => {
  const base = getBaseUrl();
  const slug = memorial.customSlug || memorial.shareUrl || memorial._id;
  // customSlug/short share идут в корень, иначе используем префикс /memorial
  if (memorial.customSlug || memorial.shareUrl) return `${base}/${slug}`;
  return `${base}/memorial/${slug}`;
};

export const getMemorialShareUrl = (memorial) => buildUrl(memorial);

export const getMemorialDisplayUrl = (memorial) => buildUrl(memorial);
