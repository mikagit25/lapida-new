import React, { useState } from 'react';
import PhotoComments from '../components/PhotoComments';
import { useAuth } from '../context/AuthContext';

const TestPhotoComments = () => {
  const { isAuthenticated, user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState('');

  // Тестовые фотографии
  const testPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      title: 'Тестовая фотография 1'
    },
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      title: 'Тестовая фотография 2'
    },
    {
      url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c23a?w=400&h=300&fit=crop',
      title: 'Тестовая фотография 3'
    }
  ];

  const openComments = (photoUrl) => {
    setCurrentPhoto(photoUrl);
    setShowComments(true);
  };

  const closeComments = () => {
    setShowComments(false);
    setCurrentPhoto('');
  };

  // Тестовый ID мемориала
  const testMemorialId = '60b5e1234567890123456789';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Тест комментариев к фотографиям
            </h1>
            <p className="text-gray-600">
              Проверка функционала комментирования фотографий в мемориале
            </p>
            {!isAuthenticated && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700">
                  Войдите в систему, чтобы оставлять комментарии к фотографиям
                </p>
              </div>
            )}
            {isAuthenticated && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">
                  Добро пожаловать, {user?.name || 'Пользователь'}! Вы можете оставлять комментарии к фотографиям.
                </p>
              </div>
            )}
          </div>

          {/* Галерея тестовых фотографий */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testPhotos.map((photo, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => openComments(photo.url)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors opacity-0 hover:opacity-100 flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>Комментарии</span>
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {photo.title}
                  </h3>
                  <button
                    onClick={() => openComments(photo.url)}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>Просмотр комментариев</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Инструкции */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Инструкции по тестированию:
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                <span>Нажмите на кнопку "Комментарии" под любой фотографией</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                <span>Если авторизованы - оставьте комментарий к фотографии</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                <span>Проверьте, что комментарии сохраняются и отображаются</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                <span>Попробуйте удалить свои комментарии</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Компонент комментариев */}
      <PhotoComments
        memorialId={testMemorialId}
        photoUrl={currentPhoto}
        isVisible={showComments}
        onClose={closeComments}
      />
    </div>
  );
};

export default TestPhotoComments;
