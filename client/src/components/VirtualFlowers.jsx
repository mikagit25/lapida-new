
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { virtualItemsService } from '../services/virtualItems';
import './VirtualFlowers.css';
import './VirtualFlowers.css';

const VirtualFlowers = ({ memorialId, memorial, canEdit = false }) => {
  const { user } = useAuth();
  const [flowers, setFlowers] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const [comment, setComment] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Доступные цветы с лучшими иконками
  const availableFlowers = [
    { 
      id: 'rose', 
      name: 'Роза', 
      icon: '🌹', 
      color: '#e11d48', 
      price: 0, 
      duration: 7 * 24 * 60 * 60 * 1000,
      description: 'Красная роза любви и памяти'
    },
    { 
      id: 'tulip', 
      name: 'Тюльпан', 
      icon: '🌷', 
      color: '#ec4899', 
      price: 0, 
      duration: 5 * 24 * 60 * 60 * 1000,
      description: 'Нежный весенний тюльпан'
    },
    { 
      id: 'sunflower', 
      name: 'Подсолнух', 
      icon: '🌻', 
      color: '#f59e0b', 
      price: 0, 
      duration: 10 * 24 * 60 * 60 * 1000,
      description: 'Солнечный подсолнух радости'
    },
    { 
      id: 'lily', 
      name: 'Лилия', 
      icon: '🪷', 
      color: '#8b5cf6', 
      price: 0, 
      duration: 7 * 24 * 60 * 60 * 1000,
      description: 'Белая лилия чистоты'
    },
    { 
      id: 'bouquet', 
      name: 'Букет', 
      icon: '💐', 
      color: '#06b6d4', 
      price: 0, 
      duration: 14 * 24 * 60 * 60 * 1000,
      description: 'Праздничный букет цветов'
    },
    { 
      id: 'cherry', 
      name: 'Сакура', 
      icon: '🌸', 
      color: '#f472b6', 
      price: 0, 
      duration: 3 * 24 * 60 * 60 * 1000,
      description: 'Нежные цветы сакуры'
    }
  ];

  // Загрузка цветов
  const fetchFlowers = async () => {
    try {
      const flowersData = await virtualItemsService.getFlowers(memorialId);
      setFlowers(flowersData);
    } catch (error) {
      console.error('Ошибка при загрузке цветов:', error);
    }
  };

  useEffect(() => {
    if (memorialId) {
      fetchFlowers();
    }
  }, [memorialId]);

  // Обработчик выбора цветка
  const handleFlowerSelect = (flower) => {
    setSelectedFlower(flower);
    setShowGallery(false);
    setShowCommentModal(true);
  };

  // Добавление цветка с комментарием
  const handleAddFlower = async () => {
    try {
      if (!selectedFlower || !comment.trim()) return;
      
      const authToken = localStorage.getItem('authToken');
      const token = localStorage.getItem('token');
      
      const finalToken = authToken || token;
      if (!finalToken) {
        alert('Пожалуйста, войдите в систему');
        return;
      }
      
      await virtualItemsService.addFlower(memorialId, {
        type: selectedFlower.id,
        icon: selectedFlower.icon,
        name: selectedFlower.name,
        color: selectedFlower.color,
        comment: comment.trim(),
        duration: selectedFlower.duration
      });
      
      setComment('');
      setSelectedFlower(null);
      setShowCommentModal(false);
      
      // Показываем уведомление об успехе
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Перезагружаем цветы после добавления с небольшой задержкой
      setTimeout(async () => {
        await fetchFlowers();
      }, 500);
    } catch (error) {
      console.error('Ошибка при добавлении цветка:', error);
    }
  };

  // Фильтрация активных цветов
  const activeFlowers = flowers.filter(flower => {
    const now = new Date();
    const createdAt = new Date(flower.createdAt);
    const expiresAt = new Date(createdAt.getTime() + flower.duration);
    return now < expiresAt;
  });

  // Получаем контейнер для портала
  const avatarContainer = document.getElementById('avatar-candles-container');

  return (
    <>
      {/* Отображение цветов на аватаре через портал */}
      {activeFlowers.length > 0 && avatarContainer && createPortal(
        <div 
          className="absolute bottom-2 left-2 pointer-events-none"
          style={{ 
            zIndex: 999,
            position: 'absolute',
            bottom: '8px',
            left: '8px'
          }}
        >
          <div className="flex flex-wrap justify-start gap-1 max-w-16">
            {activeFlowers.slice(0, 6).map((flower, index) => (
              <div 
                key={`flower-${flower._id || index}`} 
                className={`relative transform transition-all duration-300 flower-${flower.type || flower.itemType || 'rose'}`}
                style={{
                  animationDelay: `${index * 0.3}s`,
                  pointerEvents: 'auto'
                }}
                title={`${flower.name || flower.itemType || 'Цветок'} от ${flower.authorName}${flower.comment ? ': ' + flower.comment : ''}`}
              >
                <div 
                  className="text-lg drop-shadow-lg filter"
                  style={{ 
                    color: flower.color || '#ec4899',
                    textShadow: `0 0 8px ${flower.color || '#ec4899'}40`,
                    fontSize: '18px',
                    lineHeight: '1'
                  }}
                >
                  {flower.icon || '🌸'}
                </div>
                {/* Эффект сияния */}
                <div 
                  className="absolute inset-0 rounded-full opacity-15 animate-pulse"
                  style={{ 
                    backgroundColor: flower.color || '#ec4899',
                    filter: 'blur(6px)'
                  }}
                />
              </div>
            ))}
            {activeFlowers.length > 6 && (
              <div 
                className="text-xs font-semibold px-1 py-0.5 rounded-full bg-pink-500 text-white shadow-lg"
                style={{ fontSize: '8px' }}
              >
                +{activeFlowers.length - 6}
              </div>
            )}
          </div>
        </div>,
        avatarContainer
      )}

      {/* Fallback: если контейнер не найден */}
      {activeFlowers.length > 0 && !avatarContainer && (
        <div className="fixed top-20 left-4 z-50 bg-pink-100 border border-pink-400 p-2 rounded">
          <p className="text-xs text-pink-800 mb-1">🌸 Контейнер для цветов не найден!</p>
          <div className="flex gap-1">
            {activeFlowers.slice(0, 3).map((flower, index) => (
              <div key={`fallback-flower-${flower._id || index}`}>
                <span style={{ color: flower.color || '#ec4899' }}>
                  {flower.icon || '🌸'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Кнопка оставить цветы */}
      {canEdit && (
        <button
          onClick={() => setShowGallery(true)}
          className="fixed bottom-20 right-6 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-30 transform hover:scale-110 group"
          title="Оставить цветы памяти"
        >
          <div className="flex items-center justify-center">
            <span className="text-2xl group-hover:animate-pulse">🌸</span>
          </div>
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Оставить цветы
          </div>
        </button>
      )}
      {/* Галерея цветов */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 flowers-modal">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  🌸 Оставить цветы памяти
                </h3>
                <p className="text-sm text-gray-600 mt-1">Выберите цветы, чтобы почтить память</p>
              </div>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableFlowers.map((flower) => (
                <div
                  key={flower.id}
                  onClick={() => handleFlowerSelect(flower)}
                  className="cursor-pointer p-6 border-2 border-gray-200 rounded-xl hover:border-pink-300 hover:bg-pink-50 transition-all duration-200 text-center transform hover:scale-105 hover:shadow-lg group flower-gallery-item"
                >
                  <div 
                    className="text-5xl mb-3 group-hover:animate-pulse transition-all duration-300" 
                    style={{ 
                      color: flower.color,
                      filter: `drop-shadow(0 0 8px ${flower.color}40)`
                    }}
                  >
                    {flower.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">{flower.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{flower.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="font-medium text-green-600">
                      {flower.price === 0 ? 'Бесплатно' : `${flower.price} ₽`}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      {Math.floor(flower.duration / (24 * 60 * 60 * 1000))} дней
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-sm text-pink-800 text-center">
                🌸 Цветы остаются на указанное время и видны всем посетителям мемориала
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления комментария */}
      {showCommentModal && selectedFlower && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 flowers-modal">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div 
                className="text-6xl mb-3 animate-pulse" 
                style={{ 
                  color: selectedFlower.color,
                  filter: `drop-shadow(0 0 12px ${selectedFlower.color}60)`
                }}
              >
                {selectedFlower.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{selectedFlower.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedFlower.description}</p>
              <div className="flex justify-center items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {selectedFlower.price === 0 ? 'Бесплатно' : `${selectedFlower.price} ₽`}
                </span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {Math.floor(selectedFlower.duration / (24 * 60 * 60 * 1000))} дней
                </span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Сообщение памяти
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Напишите слова памяти, пожелание или молитву..."
                className="w-full p-3 border-2 border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                rows="4"
                maxLength="200"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {comment.length}/200 символов
                </span>
                {comment.length > 180 && (
                  <span className="text-xs text-pink-600">
                    Осталось {200 - comment.length} символов
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedFlower(null);
                  setComment('');
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleAddFlower}
                disabled={!comment.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                🌸 Оставить цветы
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Уведомление об успешном добавлении */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-4 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌸</span>
            <span className="font-medium">Цветы оставлены!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualFlowers;