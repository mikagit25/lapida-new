import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

const GalleryImage = ({ photo, index, description, onClick }) => {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function resolveSrc() {
      if (!photo || typeof photo.url !== 'string' || !photo.url) {
        if (isMounted) setSrc('');
        return;
      }
      // Если абсолютный URL
      if (/^https?:\/\//.test(photo.url)) {
        if (isMounted) setSrc(photo.url);
      } else if (photo.url.startsWith('/')) {
        // Любой относительный путь с / (например, /upload/, /timeline/photo/)
        const cleanBase = API_BASE_URL.replace(/\/api$/, '');
        if (isMounted) setSrc(cleanBase + photo.url);
      } else {
        // Относительный путь без / (например, filename)
        const cleanBase = API_BASE_URL.replace(/\/api$/, '');
        if (isMounted) setSrc(cleanBase + '/timeline/photo/' + photo.url);
      }
    }
    resolveSrc();
    return () => { isMounted = false; };
  }, [photo]);

  if (!src) return null;
  return (
    <img
      src={src}
      alt={description || `Фото захоронения ${index + 1}`}
      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity mb-1"
      onClick={onClick}
      onError={e => { e.target.style.background = 'red'; e.target.alt = 'Ошибка загрузки'; }}
    />
  );
};

export default GalleryImage;
