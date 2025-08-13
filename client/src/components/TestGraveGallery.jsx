import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import GravePhotoGallery from './GravePhotoGallery';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const TestGraveGallery = () => {
  const { user } = useAuth();
  const [memorial, setMemorial] = useState(null);
  const [loading, setLoading] = useState(true);

  // Получаем тестовый мемориал
  useEffect(() => {
    const fetchMemorial = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/memorials/my`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const memorials = await response.json();
          if (memorials.length > 0) {
            setMemorial(memorials[0]); // Берем первый мемориал
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки мемориала:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMemorial();
    }
  }, [user]);

  // Обработчик обновления мемориала
  const handleMemorialUpdate = (updatedMemorial) => {
    setMemorial(updatedMemorial);
    console.log('Мемориал обновлен:', updatedMemorial);
  };

  if (!user) {
    return (
      <div className="p-4 text-center">
        <p>Необходимо войти в систему для тестирования галереи</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 text-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="p-4 text-center">
        <p>Не найдено мемориалов для тестирования</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Тест галереи фото захоронения</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-lg font-semibold mb-2">Информация о мемориале:</h2>
        <p><strong>Имя:</strong> {memorial.firstName} {memorial.lastName}</p>
        <p><strong>ID:</strong> {memorial._id}</p>
        <p><strong>Фото захоронения:</strong> {memorial.location?.gravePhotos?.length || 0}</p>
      </div>

      <GravePhotoGallery 
        memorial={memorial} 
        onUpdate={handleMemorialUpdate}
      />
    </div>
  );
};

export default TestGraveGallery;
