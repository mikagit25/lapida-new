import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

export function useFullImageSrc(photo) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function resolveSrc() {
      if (typeof photo?.url === 'string') {
        if (photo.url.startsWith('/upload/')) {
          const cleanBase = API_BASE_URL.replace(/\/api$/, '');
          if (isMounted) setSrc(cleanBase + photo.url);
        } else if (isMounted) {
          setSrc(photo.url);
        }
      } else if (isMounted) {
        setSrc('');
      }
    }

    resolveSrc();
    return () => {
      isMounted = false;
    };
  }, [photo]);

  return src;
}
