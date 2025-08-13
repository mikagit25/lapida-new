// Универсальный компонент для асинхронного получения и рендера изображения
function AsyncImage({ image, alt, className, ...props }) {
  const [imgUrl, setImgUrl] = React.useState('');
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const url = await fixImageUrl(typeof image === 'string' ? image : image.url);
      if (isMounted) setImgUrl(url);
    })();
    return () => { isMounted = false; };
  }, [image]);
  if (!imgUrl) return null;
  return <img src={imgUrl} alt={alt} className={className} {...props} />;
}
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl } from '../config/api';
import GalleryImage from './GalleryImage';
import ModalPhotoView from './ModalPhotoView';
// ...existing code...

// Вспомогательный хук для получения src полноразмерного фото
export function useFullImageSrc(photo) {
  const [src, setSrc] = useState('');
  useEffect(() => {
    let isMounted = true;
    async function resolveSrc() {
      if (typeof photo?.url === 'string') {
        if (photo.url.startsWith('/upload/')) {
          const baseUrl = await getApiBaseUrl();
          const cleanBase = baseUrl.replace(/\/api$/, '');
          if (isMounted) setSrc(cleanBase + photo.url);
        } else {
          if (isMounted) setSrc(photo.url);
        }
      } else {
        if (isMounted) setSrc('');
      }
    }
    resolveSrc();
    return () => { isMounted = false; };
  }, [photo]);
  return src;
}

import { fixImageUrl } from '../utils/imageUrl';

const GravePhotoGallery = ({ memorial, onUpdate }) => {
  const { user } = useAuth();
  // Получаем массив фото из memorial.location.gravePhotos
  const gravePhotos = memorial.location?.gravePhotos || [];
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [description, setDescription] = useState('');
  // useEffect для навигации по фото в модальном окне
  React.useEffect(() => {
    if (selectedPhotoIndex !== null && gravePhotos.length > 0) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setSelectedPhotoIndex(null);
        else if (e.key === 'ArrowRight') setSelectedPhotoIndex((selectedPhotoIndex + 1) % gravePhotos.length);
        else if (e.key === 'ArrowLeft') setSelectedPhotoIndex((selectedPhotoIndex - 1 + gravePhotos.length) % gravePhotos.length);
      };
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    }
  }, [selectedPhotoIndex, gravePhotos.length]);

  // Проверяем права на редактирование
  const canEdit = user && (
    memorial.createdBy === user.id || 
    memorial.createdBy._id === user.id || 
    memorial.createdBy.toString() === user.id
  );

  // ...existing code...

  // Сохраняем массив готовых URL
  const [resolvedUrls, setResolvedUrls] = useState([]);

  React.useEffect(() => {
    let isMounted = true;
    Promise.all(gravePhotos.map(photo => fixImageUrl(photo.url)))
      .then(urls => {
        if (isMounted) setResolvedUrls(urls);
      });
    return () => { isMounted = false; };
  }, [gravePhotos]);

  // Функция загрузки фото
  const handlePhotoUpload = async (file) => {
    if (!file) return;

    // Проверка размера файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Можно загружать только изображения');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('gravePhoto', file);
      if (description.trim()) {
        formData.append('description', description.trim());
      }

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен авторизации не найден');
      }

      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/memorials/${memorial._id}/grave-photo`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка сервера:', errorText);
        throw new Error(`Ошибка загрузки: ${response.status}`);
      }

      const result = await response.json();
      console.log('Фото успешно загружено:', result);
      console.log('Полный ответ сервера:', JSON.stringify(result, null, 2));

      // Обновляем мемориал
      if (onUpdate && result.memorial) {
        console.log('Обновляем мемориал с новыми фото:', result.memorial.location?.gravePhotos?.length);
        console.log('Передаем onUpdate:', typeof onUpdate);
        // Создаем функцию обновления для безопасного мерджа
        const updateFn = (prevMemorial) => ({
          ...prevMemorial,
          location: {
            ...prevMemorial.location,
            gravePhotos: result.memorial.location.gravePhotos
          }
        });
        onUpdate(updateFn);
      } else {
        console.error('Нет onUpdate функции или result.memorial:', { onUpdate: !!onUpdate, memorial: !!result.memorial });
      }

      // Очищаем описание
      setDescription('');
      
      alert('Фото успешно добавлено!');
    } catch (error) {
      console.error('Ошибка загрузки фото:', error);
      alert(`Ошибка загрузки фото: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Функция удаления фото
  const handlePhotoDelete = async (photoIndex) => {
    if (!confirm('Вы уверены, что хотите удалить это фото?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('Токен авторизации не найден');
      }

      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/memorials/${memorial._id}/grave-photo/${photoIndex}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка сервера:', errorText);
        throw new Error(`Ошибка удаления: ${response.status}`);
      }

      const result = await response.json();
      console.log('Фото успешно удалено:', result);

      // Обновляем только нужные поля мемориала
      if (onUpdate && result.memorial) {
        console.log('Обновляем мемориал после удаления, новое количество фото:', result.memorial.location?.gravePhotos?.length);
        // Создаем функцию обновления для безопасного мерджа
        const updateFn = (prevMemorial) => ({
          ...prevMemorial,
          location: {
            ...prevMemorial.location,
            gravePhotos: result.memorial.location.gravePhotos
          }
        });
        onUpdate(updateFn);
      } else {
        console.error('Нет onUpdate функции или result.memorial после удаления:', { onUpdate: !!onUpdate, memorial: !!result.memorial });
      }
      
      alert('Фото успешно удалено!');
    } catch (error) {
      console.error('Ошибка удаления фото:', error);
      alert(`Ошибка удаления фото: ${error.message}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-semibold text-gray-900 flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Фото захоронения ({gravePhotos.length})
        </h4>
      </div>

      {/* Отображение существующих фото или заглушка */}
      {gravePhotos.length > 0 ? (
        <div className="space-y-3">
          {/* Горизонтальная галерея */}
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {gravePhotos.map((photo, index) => (
              <div key={index} className="flex-shrink-0 relative">
                {/* Логируем итоговый URL для каждого фото */}
                {console.log(`[GravePhotoGallery] photo[${index}].url:`, photo.url)}
                {/* Обычный img с автоматическим base URL */}
                <GalleryImage photo={photo} index={index} description={photo.description} onClick={() => setSelectedPhotoIndex(index)} />
                {/* Старый AsyncImage можно временно закомментировать */}
                {/*
                <AsyncImage
                  image={photo}
                  alt={photo.description || `Фото захоронения ${index + 1}`}
                  className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedPhotoIndex(index)}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                */}
                {/* Кнопка удаления */}
                {canEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePhotoDelete(index);
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Описания фото */}
          {gravePhotos.some(photo => photo.description) && (
            <div className="text-xs text-gray-500 space-y-1">
              {gravePhotos.map((photo, index) => 
                photo.description ? (
                  <div key={index}>
                    <strong>Фото {index + 1}:</strong> {photo.description}
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 text-sm text-center">
            Фото захоронения не добавлены
          </p>
          {canEdit && (
            <p className="text-gray-400 text-xs mt-1">
              Нажмите кнопку ниже для загрузки
            </p>
          )}
        </div>
      )}

      {/* Кнопка добавления фото */}
      {canEdit && (
        <div className="mt-3 space-y-2">
          <input
            type="text"
            placeholder="Описание фото (необязательно)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            maxLength={200}
          />
          <label className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center cursor-pointer block transition-colors text-sm">
            {isUploading ? 'Загрузка...' : 'Добавить фото захоронения'}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  handlePhotoUpload(file);
                }
                // Очищаем input для возможности повторной загрузки того же файла
                e.target.value = '';
              }}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* Информация о файле */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Максимальный размер: 5MB | Форматы: JPG, PNG, GIF
      </div>

      {/* Модальное окно для просмотра фото (заглушка) */}
      {selectedPhotoIndex !== null && gravePhotos.length > 0 && (
        <ModalPhotoView
          photo={gravePhotos[selectedPhotoIndex]}
          description={gravePhotos[selectedPhotoIndex]?.description}
          onClose={() => setSelectedPhotoIndex(null)}
          onPrev={() => setSelectedPhotoIndex((selectedPhotoIndex - 1 + gravePhotos.length) % gravePhotos.length)}
          onNext={() => setSelectedPhotoIndex((selectedPhotoIndex + 1) % gravePhotos.length)}
        />
      )}
      {/* Обработка клавиш навигации */}
  {/* ...existing code... */}
    </div>
  );
};

export default GravePhotoGallery;
