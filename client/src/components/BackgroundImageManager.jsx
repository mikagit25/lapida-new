import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiBaseUrl } from '../config/api';

const BackgroundImageManager = ({ 
  memorial,
  onUpdate,
  canEdit = false 
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const getPageBackgroundUrl = () => {
    if (!memorial?.pageBackground) {
      return null;
    }
    // If already absolute URL, return as is
    if (memorial.pageBackground.startsWith('http')) {
      return memorial.pageBackground;
    }
    // Remove any leading /api from pageBackground to avoid double /api/api/
    let cleanPath = memorial.pageBackground.replace(/^\/api\//, '/');
    // Ensure single leading slash
    if (!cleanPath.startsWith('/')) {
      cleanPath = '/' + cleanPath;
    }
    const [apiBaseUrl, setApiBaseUrl] = React.useState('');
    React.useEffect(() => {
      getApiBaseUrl().then(setApiBaseUrl);
    }, []);
    if (!apiBaseUrl) return '';
    return `${apiBaseUrl}${cleanPath}`;
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
      formData.append('pageBackground', file);
      
      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/memorials/${memorial._id}/page-background`, {
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
      
      console.log('🎨 Upload response:', data);
      console.log('🎨 Before update - memorial.pageBackground:', memorial?.pageBackground);
      
      if (onUpdate) {
        onUpdate(prev => {
          console.log('🎨 Updating memorial state with:', data.pageBackground);
          const updated = {
            ...prev,
            pageBackground: data.pageBackground
          };
          console.log('🎨 Updated memorial:', updated);
          return updated;
        });
      }
      
      // Принудительно перезагрузить страницу для обновления фона
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      alert('Фон страницы успешно загружен! Страница будет перезагружена.');
      
    } catch (error) {
      console.error('Ошибка загрузки фона страницы:', error);
      alert('Ошибка при загрузке изображения: ' + error.message);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const removeBackground = async () => {
    if (!memorial._id) return;
    
    if (!confirm('Вы уверены, что хотите удалить фон страницы?')) {
      return;
    }
    
    try {
      setIsUploading(true);
      
      const API_BASE_URL = await getApiBaseUrl();
      const response = await fetch(`${API_BASE_URL}/memorials/${memorial._id}/page-background`, {
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
          pageBackground: null
        }));
      }
      
      alert('Фон страницы удален!');
      
    } catch (error) {
      console.error('Ошибка удаления фона страницы:', error);
      alert('Ошибка при удалении фона: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const pageBackgroundUrl = getPageBackgroundUrl();

  return (
    <div className="background-image-manager">
      {/* Фоновое изображение */}
      {pageBackgroundUrl && (
        <>
          <div 
            className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ 
              backgroundImage: `url(${pageBackgroundUrl})`,
              zIndex: -1
            }}
          />
          {/* Subtle overlay for better content readability */}
          <div 
            className="fixed inset-0 bg-white bg-opacity-20 pointer-events-none"
            style={{ zIndex: 0 }}
          />
        </>
      )}

      {/* Панель управления фоном временно скрыта */}
    </div>
  );
};

export default BackgroundImageManager;
