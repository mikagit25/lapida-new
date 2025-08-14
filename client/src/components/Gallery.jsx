import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { uploadService, newMemorialService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PhotoCommentsSimple from './PhotoCommentsSimple';
import AsyncImage from './AsyncImage';
import { fixImageUrl } from '../utils/imageUrl';

function ImageWithAsyncUrl({ image, alt, className }) {
  const [imgUrl, setImgUrl] = React.useState('');
  React.useEffect(() => {
    let isMounted = true;
    const url = typeof image === 'string' ? image : image.url;
    fixImageUrl(url).then(resolvedUrl => {
      if (isMounted) setImgUrl(resolvedUrl);
    });
    return () => { isMounted = false; };
  }, [image]);
  if (!imgUrl) return null;
  if (imgUrl === '') return null;
  return (
    <img src={imgUrl} alt={alt} className={className} onError={() => console.error('Ошибка загрузки изображения:', imgUrl)} />
  );
}

const Gallery = ({ memorialId, images, onImagesUpdate, canEdit = false, currentProfileImage, onProfileImageChange, userMode = false }) => {
  const [galleryImages, setGalleryImages] = useState(images && images.length > 0 ? images : []);
  const [recoveredImages, setRecoveredImages] = useState([]);
  // Удаление фото из галереи
  const handleDeleteImage = async (imgUrl) => {
    if (!window.confirm('Удалить это фото?')) return;
    try {
      // Проверяем, что фото есть в галерее
      const exists = galleryImages.some(img => (typeof img === 'string' ? img : img.url) === imgUrl);
      if (!exists) {
        alert('Фото не найдено в галерее');
        return;
      }
      let token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
      if (!token && document.cookie) {
        const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
        if (match) token = match[1];
      }
      const res = await fetch(`/api/memorials/${memorialId}/gallery`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ photoUrl: imgUrl })
      });
      const result = await res.json();
      console.log('Удаление файла результат:', result);
      if (!res.ok) throw new Error(result.message || 'Ошибка удаления');
      const updatedImages = galleryImages.filter(img => (typeof img === 'string' ? img : img.url) !== imgUrl);
      if (onImagesUpdate) onImagesUpdate(updatedImages);
      setGalleryImages(updatedImages);
    } catch (e) {
      console.error('Ошибка удаления файла:', e);
      alert('Ошибка удаления');
    }
  };
// ...existing code...
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsPhotoUrl, setCommentsPhotoUrl] = useState('');

  React.useEffect(() => {
  setGalleryImages(images && images.length > 0 ? images : []);
  }, [images, memorialId]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    const img = galleryImages[index];
    if (typeof img === 'string') {
      setSelectedImage({ url: img, caption: '' });
    } else {
      setSelectedImage(img);
    }
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
    setUploading(true);
    try {
      let response;
      if (memorialId && !userMode) {
        // Получаем токен
        let token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
        if (!token && document.cookie) {
          const match = document.cookie.match(/(?:^|; )token=([^;]*)/);
          if (match) token = match[1];
        }
        // Формируем FormData
        const formData = new FormData();
        Array.from(files).forEach(file => {
          formData.append('photos', file);
        });
        // Отправляем запрос
        const res = await fetch(`/api/memorials/${memorialId}/gallery`, {
          method: 'POST',
          body: formData,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          let errText = '';
          try {
            errText = await res.text();
          } catch (e) {
            errText = '(no response text)';
          }
          alert(`Ошибка загрузки (${res.status}):\n${errText}`);
          throw new Error('Upload failed: ' + res.status);
        }
        response = await res.json();
        if (onImagesUpdate) onImagesUpdate(response.galleryImages || response.images || response.fileUrls);
        setGalleryImages(response.galleryImages || response.images || response.fileUrls || []);
      } else {
        // Для профиля пользователя — как было
        response = await uploadService.uploadMultiple(Array.from(files));
        if (onImagesUpdate) onImagesUpdate(response.fileUrls);
        setGalleryImages(response.fileUrls || []);
      }
    } catch (e) {
      alert('Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };
  const handleFileSelect = (e) => {
    const files = e.target.files;
    handleFileUpload(files);
  };
  const handleSetAsProfileImage = async (imageUrl) => {
    if (!memorialId || !canEdit) return;
    try {
      console.log('handleSetAsProfileImage: imageUrl:', imageUrl);
      // Обновляем поле profileImage у мемориала через API
      const response = await newMemorialService.setProfileImage(memorialId, imageUrl);
      console.log('handleSetAsProfileImage: response:', response);
      if (onProfileImageChange) {
        onProfileImageChange(imageUrl);
      }
      alert('Главное фото успешно обновлено!');
    } catch (error) {
      console.error('Ошибка смены главного фото:', error);
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

  if (!galleryImages || galleryImages.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-6">Пока нет фотографий в галерее</p>
        {(isAuthenticated && canEdit) && (
        <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files);
              }
            }}
            onDragOver={e => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={e => {
              e.preventDefault();
              setDragOver(false);
            }}
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

  return (
    <div>
      <div className="flex flex-wrap gap-4 justify-center">
        {galleryImages.map((image, idx) => {
          const imgUrl = typeof image === 'string' ? image : image.url;
          const isProfile = currentProfileImage === imgUrl;

          return (
            <div key={idx} className="relative group cursor-pointer" onClick={() => openLightbox(idx)}>
              <ImageWithAsyncUrl
                image={image}
                alt={typeof image === 'string' ? 'Фото' : image.caption || 'Фото'}
                className="w-32 h-32 object-cover rounded shadow"
              />
              {/* Индикатор главного фото */}
              {isProfile && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs shadow-lg">Главное фото</div>
              )}
              {/* Кнопка "Сделать главным фото" */}
              {canEdit && !isProfile && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleSetAsProfileImage(imgUrl);
                  }}
                  className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 shadow-lg"
                  title="Сделать главным фото"
                >Сделать главным</button>
              )}
              {/* Кнопка удаления фото (крестик) */}
              {canEdit && (
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteImage(imgUrl);
                  }}
                  className="absolute top-1 right-1 z-10 text-red-600 text-xl font-bold px-1 py-0.5 bg-transparent border-none shadow-none hover:text-red-800"
                  title="Удалить фото"
                  style={{ lineHeight: '1', minWidth: 'unset', minHeight: 'unset' }}
                >
                  &times;
                </button>
              )}
              {/* Кнопка комментариев к фото можно добавить здесь, если потребуется */}
            </div>
          );
        })}
      </div>

      {/* Явная кнопка для добавления фото */}
      {(isAuthenticated && canEdit) && (
        <div className="flex flex-col items-center mt-8">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="gallery-upload"
            disabled={uploading}
          />
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 focus:outline-none mb-2"
            onClick={() => document.getElementById('gallery-upload').click()}
            disabled={uploading}
          >
            {uploading ? 'Загрузка файлов...' : 'Добавить фото'}
          </button>
          <p className="text-xs text-gray-400">JPG, PNG, GIF, WebP, MP4, MOV, AVI, MKV</p>
        </div>
      )}


      {/* Лайтбокс (старый вариант) */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={closeLightbox} title="Закрыть">×</button>
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl" onClick={prevImage} title="Предыдущее">‹</button>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl" onClick={nextImage} title="Следующее">›</button>
          <div className="relative max-w-3xl w-full mx-auto bg-white rounded-lg shadow-lg p-6 z-10 flex flex-col items-center">
            <AsyncImage url={selectedImage.url} alt={selectedImage.caption || 'Фото'} className="max-h-[80vh] w-auto object-contain rounded mb-4" />
            {selectedImage.caption && (
              <div className="text-center text-gray-700 mt-2">{selectedImage.caption}</div>
            )}
          </div>
        </div>
      )}




      {/* Комментарии к фото */}
      {/* Новый минималистичный блок комментариев к фото */}
      {showComments && commentsPhotoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="absolute inset-0 cursor-pointer" onClick={closeComments} />
          <div className="relative max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-6 z-10">
            <button
              onClick={closeComments}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              title="Закрыть"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <PhotoCommentsSimple
              memorialId={memorialId}
              photoUrl={commentsPhotoUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
};

Gallery.propTypes = {
  memorialId: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  onImagesUpdate: PropTypes.func,
  canEdit: PropTypes.bool,
  currentProfileImage: PropTypes.string,
  onProfileImageChange: PropTypes.func
};

export default Gallery;
