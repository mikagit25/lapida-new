// ...existing code...
import React, { useState } from 'react';
import { uploadService, newMemorialService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PhotoComments from './PhotoComments';
import { fixImageUrl } from '../utils/imageUrl';

const Gallery = ({ memorialId, images, onImagesUpdate, canEdit = false, currentProfileImage, onProfileImageChange }) => {
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsPhotoUrl, setCommentsPhotoUrl] = useState('');
  const [recoveredImages, setRecoveredImages] = useState([]);

  React.useEffect(() => {
    if ((!images || images.length === 0) && memorialId) {
      fetch(`/api/gallery-recovery/memorials/${memorialId}/images`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.images) && data.images.length > 0) {
            setRecoveredImages(data.images);
          }
        })
        .catch(err => {
          console.error('Ошибка восстановления галереи:', err);
        });
    }
  }, [images, memorialId]);

  // обработчики
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setSelectedImage(galleryImages[index]);
  };
  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % galleryImages.length;
    setLightboxIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };
  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    setLightboxIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') nextImage();
    else if (e.key === 'ArrowLeft') prevImage();
  };
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    // ...логика загрузки...
  };
  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };
  const handleSetAsProfileImage = async (imageUrl) => {
    if (!memorialId || !canEdit) return;
    // ...логика смены аватара...
  };
  const openComments = (photoUrl) => {
    setCommentsPhotoUrl(photoUrl);
    setShowComments(true);
  };
  const closeComments = () => {
    setShowComments(false);
    setCommentsPhotoUrl('');
  };

  // универсальная логика изображений
  const galleryImages = (images && images.length > 0) ? images : recoveredImages;

  if (!galleryImages || galleryImages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-6">Пока нет фотографий в галерее</p>
        {(isAuthenticated && canEdit) && (
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            onDrop={() => {}}
            onDragOver={() => {}}
            onDragLeave={() => {}}
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
            <label htmlFor="gallery-upload-empty" className="cursor-pointer flex flex-col items-center">
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
                  <p className="text-xl font-medium text-gray-600 mb-2">Добавить первые фото и видео</p>
                  <p className="text-sm text-gray-500">Перетащите файлы сюда или нажмите для выбора</p>
                  <p className="text-xs text-gray-400 mt-2">Поддерживаются: JPG, PNG, GIF, WebP, MP4, MOV, AVI, MKV</p>
                </>
              )}
            </label>
          </div>
        )}
      </div>
    );
  }

  // основной JSX для галереи
  return (
    <div>
      {/* Здесь должен быть основной JSX галереи, лайтбокс, миниатюры, комментарии */}
    </div>
  );
};

export default Gallery;
import React, { useState } from 'react';
import { uploadService, newMemorialService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PhotoComments from './PhotoComments';
import { fixImageUrl } from '../utils/imageUrl';


const Gallery = ({ memorialId, images, onImagesUpdate, canEdit = false, currentProfileImage, onProfileImageChange }) => {

  // Автоматическое восстановление галереи, если images пустой
  React.useEffect(() => {
    if ((!images || images.length === 0) && memorialId) {
      fetch(`/api/gallery-recovery/memorials/${memorialId}/images`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.images) && data.images.length > 0) {
            setRecoveredImages(data.images);
          }
        })
        .catch(err => {
          console.error('Ошибка восстановления галереи:', err);
        });
    }
  }, [images, memorialId]);

  // Все обработчики внутри компонента
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setSelectedImage(galleryImages[index]);
  };
  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % galleryImages.length;
    setLightboxIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };
  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    setLightboxIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') nextImage();
    else if (e.key === 'ArrowLeft') prevImage();
  };
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    // ...логика загрузки...
  };
  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };
  const handleSetAsProfileImage = async (imageUrl) => {
    if (!memorialId || !canEdit) return;
    // ...логика смены аватара...
  };
  const openComments = (photoUrl) => {
    setCommentsPhotoUrl(photoUrl);
    setShowComments(true);
  };
  const closeComments = () => {
    setShowComments(false);
    setCommentsPhotoUrl('');
  };

  // Универсальная логика изображений
  const galleryImages = (images && images.length > 0) ? images : recoveredImages;

  // --- JSX ---
  if (!galleryImages || galleryImages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-6">Пока нет фотографий в галерее</p>
        {(isAuthenticated && canEdit) && (
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
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
            <label htmlFor="gallery-upload-empty" className="cursor-pointer flex flex-col items-center">
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
                  <p className="text-xl font-medium text-gray-600 mb-2">Добавить первые фото и видео</p>
                  <p className="text-sm text-gray-500">Перетащите файлы сюда или нажмите для выбора</p>
                  <p className="text-xs text-gray-400 mt-2">Поддерживаются: JPG, PNG, GIF, WebP, MP4, MOV, AVI, MKV</p>
                </>
              )}
            </label>
          </div>
        )}
      </div>
    );
  }

  // Основной JSX для галереи
  return (
    <>
      {/* ...сюда вставьте основной JSX галереи, лайтбокс, миниатюры, комментарии... */}
      {/* Пример: */}
      {/* <div>Галерея изображений</div> */}
    </>
  );
};
export default Gallery;
      alert('Ошибка при смене главного фото');
    }
  };

  const handleDeleteImage = async (index) => {
    if (!memorialId || !canEdit) return;
    
    if (!confirm('Вы уверены, что хотите удалить это фото?')) {
      return;
    }
    
 
      const updatedImages = images.filter((_, i) => i !== index);
      
      // Обновляем галерею на сервере
      await newMemorialService.updateGallery(memorialId, updatedImages);
      
      // Обновляем галерею в родительском компоненте
      if (onImagesUpdate) {
        onImagesUpdate(updatedImages);
      }
      
      // Закрываем лайтбокс если удаляем текущее изображение
      if (selectedImage) {
        closeLightbox();
      }
      
      console.log('Gallery: Фото успешно удалено, обновленный массив:', updatedImages.length);
    } catch (error) {
      console.error('Ошибка при удалении фото:', error);
      alert('Ошибка при удалении фото');
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
        
        {/* Зона загрузки файлов (только для пользователей с правами редактирования) */}
        {(isAuthenticated && canEdit) && (
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

const Gallery = ({ memorialId, images, onImagesUpdate, canEdit = false, currentProfileImage, onProfileImageChange }) => {
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsPhotoUrl, setCommentsPhotoUrl] = useState('');
  const [recoveredImages, setRecoveredImages] = useState([]);

  React.useEffect(() => {
    if ((!images || images.length === 0) && memorialId) {
      fetch(`/api/gallery-recovery/memorials/${memorialId}/images`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.images) && data.images.length > 0) {
            setRecoveredImages(data.images);
          }
        })
        .catch(err => {
          console.error('Ошибка восстановления галереи:', err);
        });
    }
  }, [images, memorialId]);

  // обработчики
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setSelectedImage(galleryImages[index]);
  };
  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % galleryImages.length;
    setLightboxIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };
  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    setLightboxIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight') nextImage();
    else if (e.key === 'ArrowLeft') prevImage();
  };
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    // ...логика загрузки...
  };
  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };
  const handleSetAsProfileImage = async (imageUrl) => {
    if (!memorialId || !canEdit) return;
    // ...логика смены аватара...
  };
  const openComments = (photoUrl) => {
    setCommentsPhotoUrl(photoUrl);
    setShowComments(true);
  };
  const closeComments = () => {
    setShowComments(false);
    setCommentsPhotoUrl('');
  };

  // универсальная логика изображений
  const galleryImages = (images && images.length > 0) ? images : recoveredImages;

  if (!galleryImages || galleryImages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-6">Пока нет фотографий в галерее</p>
        {(isAuthenticated && canEdit) && (
          <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
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
            <label htmlFor="gallery-upload-empty" className="cursor-pointer flex flex-col items-center">
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
                  <p className="text-xl font-medium text-gray-600 mb-2">Добавить первые фото и видео</p>
                  <p className="text-sm text-gray-500">Перетащите файлы сюда или нажмите для выбора</p>
                  <p className="text-xs text-gray-400 mt-2">Поддерживаются: JPG, PNG, GIF, WebP, MP4, MOV, AVI, MKV</p>
                </>
              )}
            </label>
          </div>
        )}
      </div>
    );
  }

  // основной JSX для галереи
  return (
    <>
      {/* Здесь должен быть основной JSX галереи, лайтбокс, миниатюры, комментарии */}
    </>
  );
};

export default Gallery;
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
              src={fixImageUrl(typeof selectedImage === 'string' ? selectedImage : selectedImage.url)}
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

            {/* Кнопка удаления в лайтбоксе */}
            {canEdit && (
              <button
                onClick={() => handleDeleteImage(lightboxIndex)}
                className="absolute top-4 right-32 bg-red-600 bg-opacity-70 text-white px-3 py-2 rounded hover:bg-opacity-90 transition-colors flex items-center space-x-2"
                title="Удалить фото"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Удалить</span>
              </button>
            )}

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
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => openLightbox(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden ${
                    index === lightboxIndex ? 'ring-2 ring-white' : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  <img
                    src={fixImageUrl(typeof image === 'string' ? image : image.url)}
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