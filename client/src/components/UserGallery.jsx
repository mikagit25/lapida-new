import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { uploadService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PhotoCommentsSimple from './PhotoCommentsSimple';
import { fixImageUrl } from '../utils/imageUrl';

// Асинхронный компонент для отображения фото с обработкой URL
function ImageWithAsyncUrl({ image, alt, className, onClick }) {
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
  return <img src={imgUrl} alt={alt} className={className} onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }} />;
}

// Галерея пользователя (минимальный аналог мемориальной)
const UserGallery = ({ canEdit, currentProfileImage, onProfileImageChange }) => {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentsPhotoUrl, setCommentsPhotoUrl] = useState('');

  useEffect(() => {
    if (user && user.gallery && Array.isArray(user.gallery)) {
      setImages(user.gallery);
    } else if (user && user.photo) {
      setImages([user.photo]);
    }
  }, [user]);

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      // uploadService реализует загрузку в /upload/gallery/
      const response = await uploadService.uploadUserGallery(formData);
      setImages(response.images);
    } catch (e) {
      alert('Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  const handleSetAsProfileImage = async (imageUrl) => {
    try {
      // uploadService должен реализовывать смену аватара
      await uploadService.setUserAvatar({ avatar: imageUrl });
      if (onProfileImageChange) onProfileImageChange(imageUrl);
      alert('Главное фото успешно обновлено!');
    } catch (e) {
      alert('Ошибка при смене главного фото');
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Галерея пользователя</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {images.map((img, idx) => {
          const imgUrl = typeof img === 'string' ? img : img.url;
          const isProfile = currentProfileImage === imgUrl;
          return (
            <div key={idx} className="relative group cursor-pointer" onClick={() => { setSelectedImage(imgUrl); setLightboxIndex(idx); }}>
              <ImageWithAsyncUrl
                image={imgUrl}
                alt="Фото"
                className="w-32 h-32 object-cover rounded shadow"
              />
              {isProfile && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs shadow-lg">Главное фото</div>
              )}
              {canEdit && !isProfile && (
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); handleSetAsProfileImage(imgUrl); }}
                  className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 shadow-lg"
                  title="Сделать главным фото"
                >Сделать главным</button>
              )}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); setCommentsPhotoUrl(imgUrl); setShowComments(true); }}
                className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-70 text-white px-2 py-1 rounded text-xs hover:bg-opacity-90 shadow-lg"
                title="Комментарии к фото"
              >Комментарии</button>
            </div>
          );
        })}
      {/* Лайтбокс для просмотра фото */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedImage(null)} />
          <div className="relative max-w-4xl max-h-full p-4">
            <ImageWithAsyncUrl
              image={selectedImage}
              alt="Фото"
              className="max-w-full max-h-full object-contain"
            />
            {/* Счетчик */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
              {lightboxIndex + 1} из {images.length}
            </div>
            {/* Кнопки навигации */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-l"
                  onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + images.length) % images.length); setSelectedImage(typeof images[(lightboxIndex - 1 + images.length) % images.length] === 'string' ? images[(lightboxIndex - 1 + images.length) % images.length] : images[(lightboxIndex - 1 + images.length) % images.length].url); }}
                  title="Предыдущее фото"
                >&#8592;</button>
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-r"
                  onClick={e => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % images.length); setSelectedImage(typeof images[(lightboxIndex + 1) % images.length] === 'string' ? images[(lightboxIndex + 1) % images.length] : images[(lightboxIndex + 1) % images.length].url); }}
                  title="Следующее фото"
                >&#8594;</button>
              </>
            )}
            {/* Кнопка закрытия */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              title="Закрыть"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      </div>
      {canEdit && (
        <div className="flex flex-col items-center mt-8">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={e => handleFileUpload(e.target.files)}
            className="hidden"
            id="user-gallery-upload"
            disabled={uploading}
          />
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 focus:outline-none mb-2"
            onClick={() => document.getElementById('user-gallery-upload').click()}
            disabled={uploading}
          >
            {uploading ? 'Загрузка файлов...' : 'Добавить фото'}
          </button>
        </div>
      )}
      {showComments && commentsPhotoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setShowComments(false)} />
          <div className="relative max-w-md w-full mx-auto bg-white rounded-lg shadow-lg p-6 z-10">
            <button
              onClick={() => setShowComments(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
              title="Закрыть"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <PhotoCommentsSimple
              memorialId={null}
              photoUrl={commentsPhotoUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
};

UserGallery.propTypes = {
  canEdit: PropTypes.bool,
  currentProfileImage: PropTypes.string,
  onProfileImageChange: PropTypes.func,
};

export default UserGallery;
