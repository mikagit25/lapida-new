import React, { useEffect, useState } from 'react';
import { fixImageUrl } from '../utils/imageUrl';

export default function MemorialAvatar({ profileImage, photo, galleryImages, alt, className }) {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    let active = true;
    async function resolveUrl() {
      let url = profileImage || photo || (galleryImages && galleryImages.length > 0 && galleryImages[0].url) || null;
      if (url) {
        const fixed = await fixImageUrl(url);
        if (active) setImgUrl(fixed);
      } else {
        setImgUrl(null);
      }
    }
    resolveUrl();
    return () => { active = false; };
  }, [profileImage, photo, galleryImages]);

  if (imgUrl) {
    return <img src={imgUrl} alt={alt} className={className || 'w-12 h-12 rounded-full object-cover'} />;
  }
  return <div className={className || 'w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl'}>🏛️</div>;
}
