import React from 'react';

const OrganizationGallery = ({ photos }) => {
  if (!photos || photos.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {photos.map((url, i) => (
        <img key={i} src={url} alt="Фото" className="w-full h-32 object-cover rounded shadow" />
      ))}
    </div>
  );
};

export default OrganizationGallery;
