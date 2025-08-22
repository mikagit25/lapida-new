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
  // Всегда используем lapida.one
  const base = 'https://lapida.one';
  if (memorial.customSlug) {
    return `${base}/${memorial.customSlug}`;
  } else {
    return `${base}/memorial/${memorial.shareUrl || memorial._id}`;
  }
};

export const getMemorialDisplayUrl = (memorial) => {
  // Для отображения всегда используем lapida.one
  const base = 'https://lapida.one';
  if (memorial.customSlug) {
    return `${base}/${memorial.customSlug}`;
  } else {
    return `${base}/memorial/${memorial.shareUrl || memorial._id}`;
  }
};
