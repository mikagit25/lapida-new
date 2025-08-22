import React from 'react';

const BulkProductPhotoUpload = ({ photos, onChange }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // Добавляем новые файлы к уже выбранным
    const allFiles = [...(photos || []).filter(f => typeof f !== 'undefined'), ...files];
    onChange(allFiles);
  };

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <div className="flex mt-1 space-x-1">
        {photos && photos.length > 0 && photos.map((file, idx) => (
          <span key={idx} className="inline-block bg-gray-200 px-2 py-1 rounded text-xs">{file.name || file}</span>
        ))}
      </div>
    </div>
  );
};

export default BulkProductPhotoUpload;
