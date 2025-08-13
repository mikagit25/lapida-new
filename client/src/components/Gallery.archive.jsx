// Архивная копия Gallery.jsx
// Сохранено: 2025-08-06

/* Оригинальный код ниже */

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
