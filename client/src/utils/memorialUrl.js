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

export const getMemorialShareUrl = (memorial) => {
  // Берём домен из API_BASE_URL
  const apiUrl = new URL(API_BASE_URL);
  const base = `${apiUrl.protocol}//${apiUrl.hostname}`;
  if (memorial.customSlug) {
    return `${base}/${memorial.customSlug}`;
  } else {
    return `${base}/memorial/${memorial.shareUrl || memorial._id}`;
  }
};

export const getMemorialDisplayUrl = (memorial) => {
  // Берём домен из API_BASE_URL
  const apiUrl = new URL(API_BASE_URL);
  const base = `${apiUrl.protocol}//${apiUrl.hostname}`;
  if (memorial.customSlug) {
    return `${base}/${memorial.customSlug}`;
  } else {
    return `${base}/memorial/${memorial.shareUrl || memorial._id}`;
  }
};
