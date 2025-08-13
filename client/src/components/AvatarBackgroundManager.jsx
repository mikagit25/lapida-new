import React, { useState } from 'react';
import { fixImageUrl } from '../utils/imageUrl';

function ImageWithAsyncUrl({ image, alt, className }) {
  const [imgUrl, setImgUrl] = React.useState('');
  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      const url = await fixImageUrl(typeof image === 'string' ? image : image.url);
      if (isMounted) setImgUrl(url);
    })();
    return () => { isMounted = false; };
  }, [image]);
  return <img src={imgUrl} alt={alt} className={className} />;
}
import { getApiBaseUrl } from '../config/api';

const AvatarBackgroundManager = ({ 
  memorial,
  onUpdate
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarBackgroundUpload = async (event) => {
    console.log('AvatarBackgroundManager: handleAvatarBackgroundUpload вызвана');
    const file = event.target.files[0];
    if (!file) {
      console.log('AvatarBackgroundManager: Файл не выбран');
      return;
    }

    console.log('AvatarBackgroundManager: Выбран файл:', file.name, file.type, file.size);

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Размер файла не должен превышать 5MB');
      return;
    }

    console.log('AvatarBackgroundManager: Начинаем загрузку файла');
    setIsUploading(true);
    
    try {
      // Загружаем на сервер
      const formData = new FormData();
      formData.append('avatarBackground', file);
      
      console.log('AvatarBackgroundManager: Загружаем фон аватара для мемориала:', memorial._id);
      
      const API_BASE_URL = await getApiBaseUrl();
      const [apiBaseUrl, setApiBaseUrl] = React.useState('');
      React.useEffect(() => {
        getApiBaseUrl().then(setApiBaseUrl);
      }, []);
      if (!apiBaseUrl) return '';
      const response = await fetch(`${apiBaseUrl}/memorials/${memorial._id}/avatar-background`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
        },
        body: formData
      });

      console.log('AvatarBackgroundManager: Ответ сервера:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('AvatarBackgroundManager: Ошибка ответа сервера:', errorData);
        throw new Error(errorData.message || 'Ошибка загрузки');
      }

      const data = await response.json();
      console.log('AvatarBackgroundManager: Данные от сервера:', data);
      
      // Обновляем memorial с новым фоном аватара
      if (onUpdate) {
        console.log('AvatarBackgroundManager: Обновляем memorial с фоном аватара:', data.avatarBackground);
        onUpdate(prev => ({
          ...prev,
          avatarBackground: data.avatarBackground
        }));
      }
      
      alert('Фон аватара загружен успешно!');
    } catch (error) {
      console.error('Ошибка загрузки фона аватара:', error);
      alert('Ошибка при загрузке фона аватара: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // Определяем стиль фона аватара
  const getAvatarBackgroundUrl = (avatarBackground) => {
    if (!avatarBackground) return null;
    
    // Если путь уже полный (содержит http), используем как есть
    if (avatarBackground.startsWith('http')) {
      return avatarBackground;
    }
    // Удаляем ведущий /api, чтобы избежать двойного /api/api/
    let cleanPath = avatarBackground.replace(/^\/api\//, '/');
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    const [apiBaseUrlForGet, setApiBaseUrlForGet] = React.useState('');
    React.useEffect(() => {
      getApiBaseUrl().then(setApiBaseUrlForGet);
    }, []);
    if (!apiBaseUrlForGet) return '';
    return `${API_BASE_URL}${cleanPath}`;
  };

  const avatarBackgroundUrl = getAvatarBackgroundUrl(memorial.avatarBackground);
  console.log('AvatarBackgroundManager: memorial.avatarBackground:', memorial.avatarBackground);
  console.log('AvatarBackgroundManager: avatarBackgroundUrl:', avatarBackgroundUrl);

  const avatarStyle = memorial.avatarBackground ? {
    backgroundImage: `url(${avatarBackgroundUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <div className="flex-shrink-0 relative">
      {/* Фон аватара */}
      {memorial.avatarBackground && (
        <div 
          className="absolute inset-0 rounded-lg -z-10"
          style={avatarStyle}
        />
      )}
      
      {/* Портрет */}
      {memorial.profileImage ? (
        <ImageWithAsyncUrl
          image={memorial.profileImage}
          alt={memorial.fullName}
          className="w-48 h-48 md:w-64 md:h-64 rounded-lg object-cover shadow-lg relative z-20"
        />
      ) : (
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-lg bg-gray-200 flex items-center justify-center shadow-lg relative z-20">
          <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      {/* Кнопка загрузки фона аватара */}
      <div className="absolute bottom-2 right-2 z-30">
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarBackgroundUpload}
          disabled={isUploading}
          className="hidden"
          id="avatar-background-upload"
        />
        <label
          htmlFor="avatar-background-upload"
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors inline-block"
          title="Загрузить фон аватара"
        >
          {isUploading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </label>
      </div>
      
      {/* Виртуальные свечи - позиционируются относительно аватара */}
      <div id="avatar-candles-container" className="absolute inset-0 pointer-events-none">
        {/* Свечи будут вставлены сюда через портал */}
      </div>
    </div>
  );
};

export default AvatarBackgroundManager;
