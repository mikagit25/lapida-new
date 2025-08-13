import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const HeaderBackgroundManager = ({ 
  memorial,
  onUpdate,
  canEdit = false 
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);

  // Проверяем права пользователя на редактирование
  const hasEditPermission = () => {
    if (!user || !memorial) return false;
    
    const userId = user.id || user._id;
    const createdById = typeof memorial.createdBy === 'object' 
      ? memorial.createdBy._id || memorial.createdBy.id 
      : memorial.createdBy;
      
    if (createdById === userId) return true;
    if (memorial.editorsUsers && memorial.editorsUsers.includes(userId)) return true;
    
    return false;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('headerBackground', file);
      
      const response = await fetch(`${API_BASE_URL}/api/memorials/${memorial._id}/header-background`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка загрузки');
      }

      const data = await response.json();
      
      if (onUpdate) {
        onUpdate(prev => ({
          ...prev,
          headerBackground: data.headerBackground
        }));
      }
      
      setShowUploader(false);
      alert('Фон шапки успешно загружен!');
      
    } catch (error) {
      console.error('Ошибка загрузки фона шапки:', error);
      alert('Ошибка при загрузке изображения: ' + error.message);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const removeBackground = async () => {
    if (!memorial._id) return;
    
    if (!confirm('Вы уверены, что хотите удалить фон шапки?')) {
      return;
    }
    
    try {
      setIsUploading(true);
      
      const response = await fetch(`${API_BASE_URL}/api/memorials/${memorial._id}/header-background`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка удаления');
      }

      if (onUpdate) {
        onUpdate(prev => ({
          ...prev,
          headerBackground: null
        }));
      }
      
      setShowUploader(false);
      alert('Фон шапки успешно удален!');
      
    } catch (error) {
      console.error('Ошибка удаления фона шапки:', error);
      alert('Ошибка при удалении фона: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const getBackgroundImageUrl = (headerBackground) => {
    if (!headerBackground) return null;
    if (headerBackground.startsWith('http')) return headerBackground;
    return `${API_BASE_URL}${headerBackground}`;
  };

  const backgroundImageUrl = getBackgroundImageUrl(memorial.headerBackground);
  const editPermission = hasEditPermission();

  const backgroundStyle = memorial.headerBackground ? {
    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)), url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed'
  } : {
    backgroundColor: '#ffffff'
  };

  return (
    <div 
      className="bg-white shadow-sm relative z-10 transition-all duration-300"
      style={backgroundStyle}
    >
      {/* Кнопки управления фоном */}
      {canEdit && editPermission && (
        <div className="absolute top-4 right-4 z-30">
          <div className="flex space-x-2">
            {!showUploader ? (
              <button
                onClick={() => setShowUploader(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                title="Изменить фон шапки"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-3 flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id="header-background-upload"
                />
                <label
                  htmlFor="header-background-upload"
                  className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  {isUploading ? 'Загрузка...' : 'Выбрать'}
                </label>
                {memorial.headerBackground && (
                  <button
                    onClick={removeBackground}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Удалить
                  </button>
                )}
                <button
                  onClick={() => setShowUploader(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                  Отмена
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Содержимое шапки */}
      <div className="max-w-4xl mx-auto px-4 py-8 relative z-20">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Портрет с свечами */}
          <div className="flex-shrink-0 relative" id="avatar-candles-container">
            {memorial.profileImage ? (
              <img
                src={fixImageUrl(memorial.profileImage)}
                alt={memorial.fullName}
                className="w-48 h-48 rounded-lg object-cover shadow-lg border-4 border-white"
              />
            ) : (
              <div className="w-48 h-48 rounded-lg bg-gray-200 flex items-center justify-center shadow-lg border-4 border-white">
                <span className="text-gray-500 text-lg">Фото</span>
              </div>
            )}
          </div>

          {/* Основная информация */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {memorial.fullName}
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              {memorial.lifespan}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderBackgroundManager;
