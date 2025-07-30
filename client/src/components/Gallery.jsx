import React, { useState } from 'react';
import { uploadService, newMemorialService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PhotoComments from './PhotoComments';

const Gallery = ({ memorialId, images, onImagesUpdate, canEdit = false, currentProfileImage, onProfileImageChange }) => {
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsPhotoUrl, setCommentsPhotoUrl] = useState('');

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setSelectedImage(images[index]);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % images.length;
    setLightboxIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + images.length) % images.length;
    setLightboxIndex(prevIndex);
    setSelectedImage(images[prevIndex]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    try {
      const uploadResult = await uploadService.uploadMultiple(Array.from(files));
      const newImages = uploadResult.files.map(file => ({
        url: file.fileUrl,
        caption: '',
        uploadedAt: new Date().toISOString()
      }));
      
      const updatedImages = [...images, ...newImages];
      
      // Обновляем галерею на сервере
      if (memorialId) {
        await newMemorialService.updateGallery(memorialId, updatedImages);
      }
      
      // Обновляем галерею в родительском компоненте
      if (onImagesUpdate) {
        onImagesUpdate(updatedImages);
      }
    } catch (error) {
      console.error('Ошибка загрузки файлов:', error);
      alert('Ошибка при загрузке файлов');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };

  const handleSetAsProfileImage = async (imageUrl) => {
    if (!memorialId || !canEdit) return;
    
    try {
      // Обновляем profileImage мемориала на сервере
      await newMemorialService.update(memorialId, { profileImage: imageUrl });
      
      // Уведомляем родительский компонент об изменении
      if (onProfileImageChange) {
        onProfileImageChange(imageUrl);
      }
      
      alert('Главное фото успешно изменено!');
    } catch (error) {
      console.error('Ошибка при смене главного фото:', error);
      alert('Ошибка при смене главного фото');
    }
  };

  const openComments = (photoUrl) => {
    setCommentsPhotoUrl(photoUrl);
    setShowComments(true);
  };

  const closeComments = () => {
    setShowComments(false);
    setCommentsPhotoUrl('');
  };

  React.useEffect(() => {
    if (selectedImage) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, lightboxIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-6">Пока нет фотографий в галерее</p>
        
        {/* Зона загрузки файлов (только для авторизованных пользователей) */}
        {isAuthenticated && (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="gallery-upload-empty"
              disabled={uploading}
            />
            <label
              htmlFor="gallery-upload-empty"
              className="cursor-pointer flex flex-col items-center"
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                  <span className="text-gray-600">Загрузка файлов...</span>
                </div>
              ) : (
                <>
                  <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-xl font-medium text-gray-600 mb-2">
                    Добавить первые фото и видео
                  </p>
                  <p className="text-sm text-gray-500">
                    Перетащите файлы сюда или нажмите для выбора
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Поддерживаются: JPG, PNG, GIF, WebP, MP4, MOV, AVI, MKV
                  </p>
                </>
              )}
            </label>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Сетка изображений */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            onClick={() => openLightbox(index)}
          >
            <img
              src={typeof image === 'string' ? image : image.url}
              alt={typeof image === 'string' ? `Фото ${index + 1}` : image.caption || `Фото ${index + 1}`}
              className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                console.error('Ошибка загрузки изображения галереи:', typeof image === 'string' ? image : image.url);
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
            
            {/* Кнопка установки как главное фото */}
            {canEdit && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetAsProfileImage(typeof image === 'string' ? image : image.url);
                  }}
                  className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 shadow-lg"
                  title="Сделать главным фото"
                >
                  Главное фото
                </button>
              </div>
            )}

            {/* Кнопка комментариев */}
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openComments(typeof image === 'string' ? image : image.url);
                }}
                className="bg-gray-800 bg-opacity-70 text-white px-2 py-1 rounded text-xs hover:bg-opacity-90 shadow-lg flex items-center space-x-1"
                title="Комментарии к фото"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>Комментарии</span>
              </button>
            </div>
            
            {/* Индикатор текущего главного фото */}
            {currentProfileImage === (typeof image === 'string' ? image : image.url) && (
              <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs shadow-lg">
                Главное фото
              </div>
            )}
            
            {typeof image === 'object' && image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                <p className="text-white text-xs truncate">{image.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Зона загрузки файлов (только для авторизованных пользователей) */}
      {isAuthenticated && (
        <div className="mt-6">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
              id="gallery-upload"
              disabled={uploading}
            />
            <label
              htmlFor="gallery-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {uploading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-3"></div>
                  <span className="text-gray-600">Загрузка файлов...</span>
                </div>
              ) : (
                <>
                  <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-lg font-medium text-gray-600 mb-1">
                    Добавить фото и видео
                  </p>
                  <p className="text-sm text-gray-500">
                    Перетащите файлы сюда или нажмите для выбора
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Поддерживаются: JPG, PNG, GIF, WebP, MP4, MOV, AVI, MKV
                  </p>
                </>
              )}
            </label>
          </div>
        </div>
      )}

      {/* Лайтбокс */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          {/* Фон для закрытия */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={closeLightbox}
          />

          {/* Контейнер изображения */}
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={typeof selectedImage === 'string' ? selectedImage : selectedImage.url}
              alt={typeof selectedImage === 'string' ? 'Фото' : selectedImage.caption || 'Фото'}
              className="max-w-full max-h-full object-contain"
            />

            {/* Подпись */}
            {typeof selectedImage === 'object' && selectedImage.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-white text-center">{selectedImage.caption}</p>
              </div>
            )}

            {/* Счетчик */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              {lightboxIndex + 1} из {images.length}
            </div>

            {/* Кнопка закрыть */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Кнопка комментариев в лайтбоксе */}
            <button
              onClick={() => openComments(typeof selectedImage === 'string' ? selectedImage : selectedImage.url)}
              className="absolute top-4 right-16 bg-gray-800 bg-opacity-70 text-white px-3 py-2 rounded hover:bg-opacity-90 transition-colors flex items-center space-x-2"
              title="Комментарии к фото"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Комментарии</span>
            </button>

            {/* Навигация */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors p-2"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Миниатюры внизу */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden ${
                    index === lightboxIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <img
                    src={typeof image === 'string' ? image : image.url}
                    alt={`Миниатюра ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Компонент комментариев к фото */}
      <PhotoComments
        memorialId={memorialId}
        photoUrl={commentsPhotoUrl}
        isVisible={showComments}
        onClose={closeComments}
      />
    </>
  );
};

export default Gallery;
