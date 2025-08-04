/**
 * Утилита для генерации правильных URL мемориалов
 */

export const getMemorialUrl = (memorial) => {
  // Если есть customSlug, используем красивый URL
  if (memorial.customSlug) {
    return `/${memorial.customSlug}`;
  }
  
  // Иначе используем стандартный URL с shareUrl или _id
  return `/memorial/${memorial.shareUrl || memorial._id}`;
};

export const getMemorialShareUrl = (memorial) => {
  const currentHost = window.location.hostname;
  const isDevelopment = currentHost === 'localhost';
  const isProduction = currentHost === 'lapida.one';
  
  if (memorial.customSlug) {
    if (isDevelopment) {
      // В разработке используем публичный адрес для QR и профиля
      return `https://lapida.one/${memorial.customSlug}`;
    } else {
      // На любом хостинге используем lapida.one
      return `https://lapida.one/${memorial.customSlug}`;
    }
  } else {
    // Фоллбэк на старый формат если нет customSlug
    if (isDevelopment) {
      // В разработке используем публичный адрес для QR и профиля
      return `https://lapida.one/memorial/${memorial.shareUrl || memorial._id}`;
    } else {
      // На любом хостинге используем lapida.one
      return `https://lapida.one/memorial/${memorial.shareUrl || memorial._id}`;
    }
  }
};

export const getMemorialDisplayUrl = (memorial) => {
  const currentHost = window.location.hostname;
  const isDevelopment = currentHost === 'localhost';
  const isProduction = currentHost === 'lapida.one';
  
  if (memorial.customSlug) {
    // Всегда показываем публичный адрес для профиля
    return `lapida.one/${memorial.customSlug}`;
  } else {
    // Фоллбэк на старый формат если нет customSlug
    return `lapida.one/memorial/${memorial.shareUrl || memorial._id}`;
  }
};
