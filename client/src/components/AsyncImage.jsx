import React from 'react';
import { fixImageUrl } from '../utils/imageUrl';

export default function AsyncImage({ url, alt, className }) {
  const [imgUrl, setImgUrl] = React.useState('');
  React.useEffect(() => {
    let isMounted = true;
    fixImageUrl(url).then(resolvedUrl => {
      if (isMounted) setImgUrl(resolvedUrl);
    });
    return () => { isMounted = false; };
  }, [url]);
  if (!imgUrl) return null;
  return (
    <img
      src={imgUrl}
      alt={alt}
      className={className || 'max-h-[80vh] w-auto object-contain rounded mb-4'}
      onError={e => { e.target.src = 'https://via.placeholder.com/600x400?text=Фото+недоступно'; }}
    />
  );
}
