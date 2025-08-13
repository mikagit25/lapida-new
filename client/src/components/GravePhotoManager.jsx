import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config/api';

const GravePhotoManager = ({ memorial, onUpdate }) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Проверяем права на редактирование
  const canEdit = user && (
    memorial.createdBy === user.id || 
    memorial.createdBy._id === user.id || 
    memorial.createdBy.toString() === user.id
  );

  console.log('GravePhotoManager Debug:', {
    user: user,
    userId: user?.id,
    memorialCreatedBy: memorial.createdBy,
    canEdit: canEdit,
    hasAuthToken: !!localStorage.getItem('authToken')
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверка авторизации
    const authToken = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (!authToken) {
      alert('Вы должны быть авторизованы для загрузки фото');
      return;
    }

    if (!user) {
      alert('Пользователь не авторизован');
      return;
    }

    console.log('=== Начало загрузки фото захоронения ===');
    console.log('Файл:', file.name, file.size, file.type);
    console.log('Memorial ID:', memorial._id);
    console.log('Token exists:', !!authToken);
    console.log('User:', user);

    // Проверка размера файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Файл слишком большой. Максимальный размер: 5MB');
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert('Разрешены только изображения');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('gravePhoto', file);

      console.log('Отправка запроса на:', `${API_BASE_URL}/memorials/${memorial._id}/grave-photo`);

      const response = await fetch(`${API_BASE_URL}/memorials/${memorial._id}/grave-photo`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      console.log('Ответ сервера:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Ошибка от сервера:', errorData);
        throw new Error(errorData.message || 'Ошибка загрузки');
      }

      const data = await response.json();
      console.log('Успешный ответ:', data);
      
      // Обновляем мемориал с новым фото
      const updatedMemorial = {
        ...memorial,
        location: {
          ...memorial.location,
          gravePhoto: data.gravePhoto
        }
      };
      
      onUpdate(updatedMemorial);
      
      console.log('Фото захоронения успешно загружено:', data.gravePhoto);
      console.log('=== Загрузка завершена успешно ===');
    } catch (error) {
      console.error('=== ОШИБКА при загрузке фото захоронения ===', error);
      alert('Ошибка загрузки фото: ' + error.message);
    } finally {
      setIsUploading(false);
      // Очищаем input
      event.target.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm('Удалить фото захоронения?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/memorials/${memorial._id}/grave-photo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка удаления');
      }

      // Обновляем мемориал без фото
      const updatedMemorial = {
        ...memorial,
        location: {
          ...memorial.location,
          gravePhoto: null
        }
      };
      
      onUpdate(updatedMemorial);
      
      console.log('Фото захоронения удалено');
    } catch (error) {
      console.error('Ошибка удаления фото захоронения:', error);
      alert('Ошибка удаления фото: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-semibold text-gray-900 flex items-center">
          <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Фото захоронения
        </h4>
      </div>

      {memorial.location?.gravePhoto ? (
        <div className="space-y-3">
          {/* Отображение текущего фото */}
          <div className="relative">
            <img
              src={fixImageUrl(memorial.location.gravePhoto)}
              alt="Фото захоронения"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div 
              className="w-full h-48 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hidden"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Кнопки управления */}
          {canEdit && (
            <div className="flex space-x-2">
              <label className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 text-center cursor-pointer text-sm transition-colors">
                {isUploading ? 'Загрузка...' : 'Заменить фото'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleRemovePhoto}
                disabled={isDeleting}
                className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm transition-colors"
              >
                {isDeleting ? 'Удаление...' : 'Удалить'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* Заглушка когда нет фото */}
          <div className="w-full h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center">
            <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-500 text-sm text-center">
              Фото захоронения не добавлено
            </p>
            {canEdit && (
              <p className="text-gray-400 text-xs mt-1">
                Нажмите кнопку ниже для загрузки
              </p>
            )}
          </div>

          {/* Кнопка загрузки */}
          {canEdit && (
            <label className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center cursor-pointer block transition-colors">
              {isUploading ? 'Загрузка...' : 'Добавить фото захоронения'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}

      {/* Информация о файле */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Максимальный размер: 5MB | Форматы: JPG, PNG, GIF
      </div>
    </div>
  );
};

export default GravePhotoManager;
