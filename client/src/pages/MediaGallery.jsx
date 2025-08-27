import React from 'react';
import MediaUpload from '../components/MediaUpload';
import MediaList from '../components/MediaList';

const MediaGallery = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Мультимедиа</h1>
      <MediaUpload />
      <MediaList />
    </div>
  );
};

export default MediaGallery;
