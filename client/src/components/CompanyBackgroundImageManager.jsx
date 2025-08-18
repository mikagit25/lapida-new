import React, { useState } from 'react';
import { getApiBaseUrl } from '../config/api';

const CompanyBackgroundImageManager = ({ company, onUpdate, canEdit = false }) => {
  const [isUploading, setIsUploading] = useState(false);

  const getPageBackgroundUrl = () => {
    if (!company?.pageBackground) return null;
    if (company.pageBackground.startsWith('http')) return company.pageBackground;
    let cleanPath = company.pageBackground.replace(/^\/api\//, '/');
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    return `${window.location.origin}${cleanPath}`;
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
      const API_BASE_URL = window.location.origin;
      const response = await fetch(`${API_BASE_URL}/api/companies/${company._id}/page-background`, {
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
        onUpdate(prev => ({ ...prev, pageBackground: data.pageBackground }));
      }
      setTimeout(() => { window.location.reload(); }, 1000);
      alert('Фон страницы успешно загружен! Страница будет перезагружена.');
    } catch (error) {
      alert('Ошибка при загрузке изображения: ' + error.message);
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const removeBackground = async () => {
    if (!company._id) return;
    if (!window.confirm('Вы уверены, что хотите удалить фон страницы?')) return;
    try {
      setIsUploading(true);
      const API_BASE_URL = window.location.origin;
      const response = await fetch(`${API_BASE_URL}/api/companies/${company._id}/page-background`, {
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
        onUpdate(prev => ({ ...prev, pageBackground: null }));
      }
      alert('Фон страницы удален!');
      setTimeout(() => { window.location.reload(); }, 1000);
    } catch (error) {
      alert('Ошибка при удалении фона: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const pageBackgroundUrl = getPageBackgroundUrl();

  return (
    <div className="company-background-image-manager">
      {pageBackgroundUrl && (
        <>
          <div 
            className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: `url(${pageBackgroundUrl})`, zIndex: -1 }}
          />
          <div 
            className="fixed inset-0 bg-white bg-opacity-20 pointer-events-none"
            style={{ zIndex: 0 }}
          />
        </>
      )}
      {canEdit && (
        <div className="absolute top-4 right-4 z-10 bg-white bg-opacity-80 rounded shadow p-2 flex gap-2 items-center">
          <label className="bg-blue-600 text-white px-2 py-1 rounded cursor-pointer text-xs">
            Загрузить фон
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} style={{ display: 'none' }} />
          </label>
          {pageBackgroundUrl && (
            <button className="bg-red-600 text-white px-2 py-1 rounded text-xs" onClick={removeBackground} disabled={isUploading}>Удалить фон</button>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyBackgroundImageManager;
