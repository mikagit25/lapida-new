import React from 'react';
import { useFullImageSrc } from './GravePhotoGallery';

const TimelinePhotoModal = ({ photo, description, onClose }) => {
  const src = useFullImageSrc(photo);
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80" style={{ zIndex: 9999 }}>
      <button
        className="absolute top-4 right-4 text-white text-3xl"
        onClick={onClose}
        title="Закрыть"
      >×</button>
      <div className="relative max-w-3xl w-full mx-auto bg-white rounded-lg shadow-lg p-6 z-10 flex flex-col items-center">
        {src ? (
          <img
            src={src}
            alt={description || 'Фото таймлайна'}
            className="max-h-[80vh] w-auto object-contain rounded mb-4"
            onError={e => { e.target.style.background = 'red'; e.target.alt = 'Ошибка загрузки'; }}
          />
        ) : null}
        {description && (
          <div className="text-center text-gray-700 mt-2">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePhotoModal;
