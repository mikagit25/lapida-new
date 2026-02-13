import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { virtualItemsService } from '../services/virtualItems';
import './VirtualCandles.css';

const VirtualCandles = ({ memorialId, memorial, canEdit = false }) => {
  const { user } = useAuth();
  const [candles, setCandles] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedCandle, setSelectedCandle] = useState(null);
  const [comment, setComment] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  void memorial;
  const isAuthenticated = Boolean(user);

  // Доступные свечи
  const availableCandles = [
    { 
      id: 'classic', 
      name: 'Классическая', 
      icon: '🕯️', 
      color: '#f59e0b', 
      price: 0, 
      duration: 24 * 60 * 60 * 1000,
      description: 'Традиционная свеча памяти'
    },
    { 
      id: 'memorial', 
      name: 'Поминальная', 
      icon: '🕯️', 
      color: '#6b7280', 
      price: 0, 
      duration: 48 * 60 * 60 * 1000,
      description: 'Поминальная свеча на два дня'
    },
    { 
      id: 'church', 
      name: 'Церковная', 
      icon: '🕯️', 
      color: '#fbbf24', 
      price: 0, 
      duration: 72 * 60 * 60 * 1000,
      description: 'Церковная свеча на три дня'
    },
    { 
      id: 'eternal', 
      name: 'Вечная память', 
      icon: '🕯️', 
      color: '#ef4444', 
      price: 0, 
      duration: 7 * 24 * 60 * 60 * 1000,
      description: 'Свеча вечной памяти на неделю'
    },
    { 
      id: 'angel', 
      name: 'Ангельская', 
      icon: '🕯️', 
      color: '#ffffff', 
      price: 0, 
      duration: 12 * 60 * 60 * 1000,
      description: 'Белая ангельская свеча'
    },
    { 
      id: 'golden', 
      name: 'Золотая', 
      icon: '🕯️', 
      color: '#ffd700', 
      price: 0, 
      duration: 5 * 24 * 60 * 60 * 1000,
      description: 'Праздничная золотая свеча'
    }
  ];

  // Загрузка свечей
  const fetchCandles = useCallback(async () => {
    try {
      const candlesData = await virtualItemsService.getCandles(memorialId);
      setCandles(candlesData);
    } catch (error) {
      console.error('Ошибка при загрузке свечей:', error);
    }
  }, [memorialId]);

  useEffect(() => {
    if (memorialId) {
      fetchCandles();
    }
  }, [memorialId, fetchCandles]);

  // Обработчик выбора свечи
  const handleCandleSelect = (candle) => {
    setSelectedCandle(candle);
    if (!isAuthenticated) {
      alert('Войдите, чтобы зажечь свечу');
      return;
    }
    setShowGallery(false);
    setShowCommentModal(true);
  };

  // Добавление свечи с комментарием
  const handleAddCandle = async () => {
    try {
      if (!selectedCandle || !comment.trim()) return;
      
      const authToken = localStorage.getItem('authToken');
      const token = localStorage.getItem('token');
      
      const finalToken = authToken || token;
      if (!finalToken) {
        alert('Пожалуйста, войдите в систему');
        return;
      }
      
      await virtualItemsService.addCandle(memorialId, {
        type: selectedCandle.id,
        icon: selectedCandle.icon,
        name: selectedCandle.name,
        color: selectedCandle.color,
        comment: comment.trim(),
        duration: selectedCandle.duration
      });
      
      setComment('');
      setSelectedCandle(null);
      setShowCommentModal(false);
      
      // Показываем уведомление об успехе
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
      // Перезагружаем свечи после добавления с небольшой задержкой
      setTimeout(async () => {
        await fetchCandles();
      }, 500);
    } catch (error) {
      console.error('Ошибка при добавлении свечи:', error);
    }
  };

  // Фильтрация активных свечей
  const activeCandles = candles.filter(candle => {
    const now = new Date();
    const createdAt = new Date(candle.createdAt);
    const expiresAt = new Date(createdAt.getTime() + candle.duration);
    return now < expiresAt;
  });

  // Получаем контейнер для портала
  const avatarContainer = document.getElementById('avatar-candles-container');
  
  return (
    <>
      {/* Отображение свечей на аватаре через портал */}
      {activeCandles.length > 0 && avatarContainer && createPortal(
        <div 
          className="absolute bottom-2 right-2 pointer-events-none"
          style={{ 
            zIndex: 999,
            position: 'absolute',
            bottom: '8px',
            right: '8px'
          }}
        >
          <div className="flex flex-wrap justify-end gap-1 max-w-16">
            {activeCandles.slice(0, 6).map((candle, index) => (
              <div 
                key={`candle-${candle._id || index}`} 
                className="relative transform transition-all duration-300"
                style={{
                  animationName: 'candleFlicker',
                  animationDuration: '2s',
                  animationTimingFunction: 'ease-in-out',
                  animationIterationCount: 'infinite',
                  animationDirection: 'alternate',
                  animationDelay: `${index * 0.2}s`,
                  pointerEvents: 'auto'
                }}
                title={`${candle.name || candle.itemType || 'Свеча'} от ${candle.authorName}${candle.comment ? ': ' + candle.comment : ''}`}
              >
                  <div 
                    className="text-lg drop-shadow-lg filter"
                    style={{ 
                      color: candle.color || '#f59e0b',
                      textShadow: `0 0 8px ${candle.color || '#f59e0b'}40`,
                      fontSize: '18px',
                      lineHeight: '1'
                    }}
                  >
                    {candle.icon || '🕯️'}
                  </div>
                  {/* Эффект мерцания */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-20 animate-pulse"
                    style={{ 
                      backgroundColor: candle.color || '#f59e0b',
                      filter: 'blur(4px)'
                    }}
                  />
                </div>
            ))}
            {activeCandles.length > 6 && (
              <div 
                className="text-xs font-semibold px-1 py-0.5 rounded-full bg-orange-500 text-white shadow-lg"
                style={{ fontSize: '8px' }}
              >
                +{activeCandles.length - 6}
              </div>
            )}
          </div>
        </div>,
        avatarContainer
      )}

      {/* Дебаг: показываем если контейнер для свечей не найден */}
      {activeCandles.length > 0 && !avatarContainer && (
        <div className="fixed top-20 right-4 z-50 bg-red-100 border border-red-400 p-2 rounded">
          <p className="text-xs text-red-800 mb-1">❌ Контейнер для свечей не найден!</p>
          <div className="flex gap-1">
            {activeCandles.slice(0, 3).map((candle, index) => (
              <div key={`fallback-candle-${candle._id || index}`}>
                <span style={{ color: candle.color || '#f59e0b' }}>
                  {candle.icon || '🕯️'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Кнопка зажечь свечу */}
      {canEdit && (
        <button
          onClick={() => setShowGallery(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-30 transform hover:scale-110 group"
          title="Зажечь свечу памяти"
        >
          <div className="flex items-center justify-center">
            <span className="text-2xl group-hover:animate-pulse">🕯️</span>
          </div>
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
            Зажечь свечу
          </div>
        </button>
      )}

      {/* Галерея свечей */}
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  🕯️ Зажечь свечу памяти
                </h3>
                <p className="text-sm text-gray-600 mt-1">Выберите свечу, чтобы почтить память</p>
              </div>
              <button
                onClick={() => setShowGallery(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableCandles.map((candle) => (
                <div
                  key={candle.id}
                  onClick={() => handleCandleSelect(candle)}
                  className="cursor-pointer p-6 border-2 border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-center transform hover:scale-105 hover:shadow-lg group"
                >
                  <div 
                    className="text-5xl mb-3 group-hover:animate-pulse transition-all duration-300" 
                    style={{ 
                      color: candle.color,
                      filter: `drop-shadow(0 0 8px ${candle.color}40)`
                    }}
                  >
                    {candle.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">{candle.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{candle.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span className="font-medium text-green-600">
                      {candle.price === 0 ? 'Бесплатно' : `${candle.price} ₽`}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded-full">
                      {Math.floor(candle.duration / (60 * 60 * 1000))} ч
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-800 text-center">
                💡 Свечи зажигаются на указанное время и видны всем посетителям мемориала
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно добавления комментария */}
      {showCommentModal && selectedCandle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div 
                className="text-6xl mb-3 animate-pulse" 
                style={{ 
                  color: selectedCandle.color,
                  filter: `drop-shadow(0 0 12px ${selectedCandle.color}60)`
                }}
              >
                {selectedCandle.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{selectedCandle.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedCandle.description}</p>
              <div className="flex justify-center items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {selectedCandle.price === 0 ? 'Бесплатно' : `${selectedCandle.price} ₽`}
                </span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {Math.floor(selectedCandle.duration / (60 * 60 * 1000))} часов
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
                placeholder="Напишите слова памяти, молитву или пожелание..."
                className="w-full p-3 border-2 border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                rows="4"
                maxLength="200"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {comment.length}/200 символов
                </span>
                {comment.length > 180 && (
                  <span className="text-xs text-orange-600">
                    Осталось {200 - comment.length} символов
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setSelectedCandle(null);
                  setComment('');
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleAddCandle}
                disabled={!comment.trim()}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                🕯️ Зажечь свечу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Уведомление об успешном добавлении */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="text-lg">🕯️</span>
            <span className="font-medium">Свеча зажжена!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualCandles;
