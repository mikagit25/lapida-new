import React, { useState } from 'react';
import PhotoComments from './PhotoComments';

const TimelinePhotoModal = ({ photo, memorialId, isOpen, onClose, allPhotos, currentIndex, onNavigate }) => {
  const [showComments, setShowComments] = useState(false);

  if (!isOpen || !photo) return null;

  const photoUrl = photo.url || photo;
  const photoCaption = photo.caption || '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="max-w-6xl max-h-full w-full h-full flex flex-col">
        {/* Заголовок с кнопками */}
        <div className="flex items-center justify-between p-4 text-white">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold">
              Фото {currentIndex + 1} из {allPhotos.length}
            </h3>
            {photoCaption && (
              <span className="text-gray-300">{photoCaption}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowComments(!showComments)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <span>💬</span>
              <span>{showComments ? 'Скрыть комментарии' : 'Комментарии'}</span>
            </button>
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-lg"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 flex overflow-hidden">
          {/* Область изображения */}
          <div className="flex-1 flex items-center justify-center relative">
            {/* Навигация - предыдущее фото */}
            {allPhotos.length > 1 && currentIndex > 0 && (
              <button
                onClick={() => onNavigate(currentIndex - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 z-10"
              >
                ←
              </button>
            )}

            {/* Изображение */}
            <img
              src={photoUrl}
              alt={photoCaption || 'Фото из timeline'}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                console.error('Ошибка загрузки фото:', photoUrl);
              }}
            />

            {/* Навигация - следующее фото */}
            {allPhotos.length > 1 && currentIndex < allPhotos.length - 1 && (
              <button
                onClick={() => onNavigate(currentIndex + 1)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 z-10"
              >
                →
              </button>
            )}
          </div>

          {/* Панель комментариев */}
          {showComments && (
            <div className="w-80 bg-white flex flex-col">
              <PhotoComments
                memorialId={memorialId}
                photoUrl={photoUrl}
                isVisible={showComments}
                onClose={() => setShowComments(false)}
              />
            </div>
          )}
        </div>

        {/* Миниатюры (если больше одного фото) */}
        {allPhotos.length > 1 && (
          <div className="p-4 bg-black bg-opacity-30">
            <div className="flex space-x-2 overflow-x-auto">
              {allPhotos.map((thumbnail, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    index === currentIndex ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img
                    src={thumbnail.url || thumbnail}
                    alt={`Миниатюра ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelinePhotoModal;
