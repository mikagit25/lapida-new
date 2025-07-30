import React, { useState } from 'react';
import TimelinePhotoModal from './TimelinePhotoModal';

const TimelineEvent = ({ 
  event, 
  index, 
  getEventIcon, 
  getEventTypeLabel, 
  formatDate, 
  isAuthenticated, 
  user, 
  onEdit, 
  onDelete,
  memorialId
}) => {
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  
  const canEdit = isAuthenticated && user && (user.id === event.author || user.role === 'admin');

  const handlePhotoClick = (photoIndex) => {
    setSelectedPhotoIndex(photoIndex);
    setPhotoModalOpen(true);
  };

  const handlePhotoNavigate = (newIndex) => {
    setSelectedPhotoIndex(newIndex);
  };

  return (
    <div className="relative flex items-start space-x-4">
      {/* Иконка события */}
      <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl relative z-10">
        {getEventIcon(event.eventType)}
      </div>

      {/* Содержимое события */}
      <div className="flex-1 min-w-0">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          {/* Заголовок события */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {event.title}
              </h3>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  {getEventTypeLabel(event.eventType)}
                </span>
                <span>{formatDate(event.date)}</span>
                {event.formattedAge && (
                  <span className="text-gray-500">
                    • {event.formattedAge}
                  </span>
                )}
                {event.location && (
                  <span className="text-gray-500">
                    • 📍 {event.location}
                  </span>
                )}
              </div>
            </div>

            {/* Кнопки управления */}
            {canEdit && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(event)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => onDelete(event._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Удалить
                </button>
              </div>
            )}
          </div>

          {/* Описание */}
          {event.description && (
            <p className="text-gray-700 mb-3 whitespace-pre-wrap">
              {event.description}
            </p>
          )}

          {/* Фотографии */}
          {event.photos && event.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              {event.photos.map((photo, photoIndex) => (
                <div key={photoIndex} className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative group">
                  <img
                    src={photo.url || photo}
                    alt={photo.caption || `Фото ${photoIndex + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                    onClick={() => handlePhotoClick(photoIndex)}
                    onError={(e) => {
                      console.error('Ошибка загрузки фото:', photo.url || photo);
                      e.target.style.display = 'none';
                    }}
                  />
                  {/* Иконка комментариев */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="bg-black bg-opacity-50 text-white p-1 rounded-full text-xs">
                      💬
                    </button>
                  </div>
                  {/* Подпись к фото */}
                  {photo.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                      <p className="text-white text-xs">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Метаданные */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>
              Добавлено {event.authorName} • {formatDate(event.createdAt)}
            </span>
            {event.updatedAt !== event.createdAt && (
              <span>
                Изменено {formatDate(event.updatedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно для просмотра фотографий */}
      {event.photos && event.photos.length > 0 && (
        <TimelinePhotoModal
          photo={event.photos[selectedPhotoIndex]}
          memorialId={memorialId}
          isOpen={photoModalOpen}
          onClose={() => setPhotoModalOpen(false)}
          allPhotos={event.photos}
          currentIndex={selectedPhotoIndex}
          onNavigate={handlePhotoNavigate}
        />
      )}
    </div>
  );
};

export default TimelineEvent;
