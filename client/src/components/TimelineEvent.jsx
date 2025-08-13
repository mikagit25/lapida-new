import React, { useState } from 'react';
import TimelinePhotoModal from './TimelinePhotoModal';
import GalleryImage from './GalleryImage';
import { fixImageUrl } from '../utils/imageUrl';
import { getApiBaseUrl } from '../config/api';

const TimelineEvent = ({ 
  event, 
  index, 
  getEventIcon, 
  getEventTypeLabel, 
  formatDate, 
  isAuthenticated, 
  user, 
  onEdit, 
  onDelete 
}) => {
  const canEdit = isAuthenticated && user && (user.id === event.author || user.role === 'admin');

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPhotoDescription, setSelectedPhotoDescription] = useState('');

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
          {Array.isArray(event.photos) && event.photos.filter(photo => {
            // Фильтруем только валидные фото
            if (!photo) return false;
            if (typeof photo === 'string') return !!photo.trim();
            if (typeof photo === 'object') return !!(photo.filename || photo.url || photo.path);
            return false;
          }).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
              {event.photos.filter(photo => {
                if (!photo) return false;
                if (typeof photo === 'string') return !!photo.trim();
                if (typeof photo === 'object') return !!(photo.filename || photo.url || photo.path);
                return false;
              }).map((photo, photoIndex) => {
                let photoUrl = '';
                let description = '';
                if (typeof photo === 'string') {
                  photoUrl = photo;
                } else if (photo && typeof photo === 'object') {
                  photoUrl = photo.filename || photo.url || photo.path || '';
                  description = photo.description || '';
                }
                if (!photoUrl) return null;
                return (
                  <div key={photoIndex} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <GalleryImage
                      photo={{ url: photoUrl }}
                      index={photoIndex}
                      description={description}
                      onClick={() => {
                        setSelectedPhoto({ url: photoUrl });
                        setSelectedPhotoDescription(description);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Модальное окно для увеличения фото таймлайна */}
          {selectedPhoto && (
            <TimelinePhotoModal
              photo={selectedPhoto}
              description={selectedPhotoDescription}
              onClose={() => setSelectedPhoto(null)}
            />
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
    </div>
  );
};

export default TimelineEvent;
