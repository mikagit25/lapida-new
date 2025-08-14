import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import AsyncImage from './AsyncImage';

const CompanyGallery = ({ companyId, images, isOwner, onImagesUpdate }) => {
  const [galleryImages, setGalleryImages] = useState(images && images.length > 0 ? images : []);
  const { isAuthenticated } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  React.useEffect(() => {
    setGalleryImages(images && images.length > 0 ? images : []);
  }, [images]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    const img = galleryImages[index];
    setSelectedImage(typeof img === 'string' ? { url: img } : { url: img });
  };
  const closeLightbox = () => setSelectedImage(null);
  const nextImage = () => {
    const nextIndex = (lightboxIndex + 1) % galleryImages.length;
    setLightboxIndex(nextIndex);
    const img = galleryImages[nextIndex];
    setSelectedImage(typeof img === 'string' ? { url: img } : { url: img });
  };
  const prevImage = () => {
    const prevIndex = (lightboxIndex - 1 + galleryImages.length) % galleryImages.length;
    setLightboxIndex(prevIndex);
    const img = galleryImages[prevIndex];
    setSelectedImage(typeof img === 'string' ? { url: img } : { url: img });
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
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('image', file);
      });
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/companies/${companyId}/gallery`, {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Ошибка загрузки');
      const data = await res.json();
      setGalleryImages(data.gallery || data.images || []);
      if (onImagesUpdate) onImagesUpdate(data.gallery || data.images || []);
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
  const handleDeleteImage = async (imgUrl) => {
    if (!window.confirm('Удалить это фото?')) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/companies/${companyId}/gallery`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ url: imgUrl }),
      });
      if (!res.ok) throw new Error('Ошибка удаления');
      const data = await res.json();
      setGalleryImages(data.gallery || []);
      if (onImagesUpdate) onImagesUpdate(data.gallery || []);
    } catch (e) {
      alert('Ошибка удаления');
    } finally {
      setUploading(false);
    }
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
        {(isAuthenticated && isOwner) && (
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
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="company-gallery-upload-empty"
              disabled={uploading}
            />
            <label htmlFor="company-gallery-upload-empty" className="cursor-pointer flex flex-col items-center">
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
                  <p className="text-xl font-medium text-gray-600 mb-2">Добавить первые фото</p>
                  <p className="text-sm text-gray-500">Перетащите файлы сюда или нажмите для выбора</p>
                  <p className="text-xs text-gray-400 mt-2">Поддерживаются: JPG, PNG, GIF, WebP</p>
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
          const imgUrl = typeof image === 'string' ? image : image;
          return (
            <div key={idx} className="relative group cursor-pointer" onClick={() => openLightbox(idx)}>
              <AsyncImage
                url={imgUrl}
                alt={'Фото'}
                className="w-32 h-32 object-cover rounded shadow"
              />
              {isOwner && (
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
            </div>
          );
        })}
      </div>
      {(isAuthenticated && isOwner) && (
        <div className="flex flex-col items-center mt-8">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="company-gallery-upload"
            disabled={uploading}
          />
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 focus:outline-none mb-2"
            onClick={() => document.getElementById('company-gallery-upload').click()}
            disabled={uploading}
          >
            {uploading ? 'Загрузка файлов...' : 'Добавить фото'}
          </button>
          <p className="text-xs text-gray-400">JPG, PNG, GIF, WebP</p>
        </div>
      )}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={closeLightbox} title="Закрыть">×</button>
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl" onClick={prevImage} title="Предыдущее">‹</button>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl" onClick={nextImage} title="Следующее">›</button>
          <div className="relative max-w-3xl w-full mx-auto bg-white rounded-lg shadow-lg p-6 z-10 flex flex-col items-center">
            <AsyncImage url={selectedImage.url} alt={'Фото'} className="max-h-[80vh] w-auto object-contain rounded mb-4" />
          </div>
        </div>
      )}
    </div>
  );
};

CompanyGallery.propTypes = {
  companyId: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  isOwner: PropTypes.bool,
  onImagesUpdate: PropTypes.func,
};

export default CompanyGallery;
