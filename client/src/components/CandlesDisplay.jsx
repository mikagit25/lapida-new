import React, { useState, useEffect } from 'react';
import { candlesDatabase } from '../data/virtualItems';

const CandlesDisplay = ({ candles = [], position = 'bottom-right' }) => {
  const [visibleCandles, setVisibleCandles] = useState([]);

  useEffect(() => {
    // Фильтруем активные свечи (не истекшие)
    const activeCandles = candles.filter(candle => {
      if (!candle.candleData?.expiresAt) return true;
      return new Date(candle.candleData.expiresAt) > new Date();
    });
    
    setVisibleCandles(activeCandles);
  }, [candles]);

  const getCandleEmoji = (candleType) => {
    const candleInfo = candlesDatabase.getById(candleType);
    return candleInfo ? candleInfo.emoji : '🕯️';
  };

  const getCandleName = (candleType) => {
    const candleInfo = candlesDatabase.getById(candleType);
    return candleInfo ? candleInfo.name : 'Свеча';
  };

  const getTimeRemaining = (candle) => {
    if (!candle.candleData?.expiresAt) return null;
    
    const now = new Date();
    const expires = new Date(candle.candleData.expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return 'Потухла';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}ч ${minutes}мин`;
    } else {
      return `${minutes}мин`;
    }
  };

  const getFlameIntensity = (candle) => {
    if (!candle.candleData?.expiresAt) return 1;
    
    const now = new Date();
    const lit = new Date(candle.candleData.litAt || candle.createdAt);
    const expires = new Date(candle.candleData.expiresAt);
    
    const totalDuration = expires - lit;
    const timeLeft = expires - now;
    
    const percentage = timeLeft / totalDuration;
    
    if (percentage > 0.7) return 1; // Яркое пламя
    if (percentage > 0.3) return 0.7; // Среднее пламя
    if (percentage > 0.1) return 0.4; // Слабое пламя
    return 0.2; // Еле горит
  };

  if (visibleCandles.length === 0) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-right': 'fixed top-20 right-4',
    'avatar-corner': 'relative',
    'inline': 'relative'
  };

  return (
    <div className={`${positionClasses[position]} z-40`}>
      {position === 'avatar-corner' ? (
        // Компактное отображение для угла аватарки
        <div className="bg-black bg-opacity-90 rounded-full p-2 backdrop-blur-sm shadow-lg">
          <div className="flex items-center gap-1">
            {visibleCandles.slice(0, 3).map((candle, index) => {
              const intensity = getFlameIntensity(candle);
              
              return (
                <div key={candle._id || index} className="relative">
                  {/* Flame effect */}
                  <div 
                    className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-xs"
                    style={{
                      opacity: intensity,
                      filter: `brightness(${intensity})`,
                    }}
                  >
                    🔥
                  </div>
                  
                  {/* Compact candle */}
                  <div className="text-lg">
                    {getCandleEmoji(candle.candleType)}
                  </div>
                </div>
              );
            })}
            
            {visibleCandles.length > 3 && (
              <div className="text-xs text-white ml-1">
                +{visibleCandles.length - 3}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Полное отображение для других позиций
        <div className="bg-black bg-opacity-80 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-center mb-3">
            <h4 className="text-sm font-medium text-white flex items-center justify-center">
              <span className="text-lg mr-2">🕯️</span>
              Горящие свечи ({visibleCandles.length})
            </h4>
          </div>

          <div className="flex flex-wrap gap-3 max-w-xs">
            {visibleCandles.map((candle, index) => {
              const timeRemaining = getTimeRemaining(candle);
              const intensity = getFlameIntensity(candle);
              
              return (
                <div
                  key={candle._id || index}
                  className="relative group"
                  title={`${getCandleName(candle.candleType)} - ${timeRemaining}`}
                >
                  {/* Flame effect */}
                  <div 
                    className="absolute -top-2 left-1/2 transform -translate-x-1/2"
                    style={{
                      opacity: intensity,
                      filter: `brightness(${intensity})`,
                    }}
                  >
                    <div className="text-lg animate-pulse">
                      🔥
                    </div>
                  </div>

                  {/* Candle */}
                  <div className="text-2xl filter drop-shadow-lg">
                    {getCandleEmoji(candle.candleType)}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <div className="font-medium">{getCandleName(candle.candleType)}</div>
                    {timeRemaining && (
                      <div className="text-gray-300">{timeRemaining}</div>
                    )}
                    {candle.text && candle.text !== getCandleName(candle.candleType) && (
                      <div className="text-gray-300 italic max-w-32 truncate">
                        "{candle.text}"
                      </div>
                    )}
                  </div>

                  {/* Wax dripping animation for longer burning candles */}
                  {intensity > 0.5 && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-4 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-full opacity-60 animate-pulse"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="mt-3 pt-2 border-t border-gray-600 text-xs text-gray-300 text-center">
            <div>Зажжено сегодня: {
              visibleCandles.filter(c => {
                const today = new Date().toDateString();
                const candleDate = new Date(c.createdAt).toDateString();
                return today === candleDate;
              }).length
            }</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandlesDisplay;
