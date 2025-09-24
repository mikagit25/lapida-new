import React from 'react';

const OrgGalleryBlock = ({ photos }) => {
  if (!photos || photos.length === 0) return null;
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Галерея</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((src, idx) => (
          <div key={idx} className="rounded overflow-hidden shadow">
            <img src={src} alt={`photo-${idx}`} className="w-full h-40 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrgGalleryBlock;
