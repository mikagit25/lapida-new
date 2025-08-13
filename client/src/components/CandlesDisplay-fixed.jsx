import React, { useState, useEffect } from 'react';
import { candlesDatabase } from '../data/virtualItems';
import PropTypes from 'prop-types';

const CandlesDisplayFixed = ({ candles = [], position = 'bottom-right' }) => {
  const [visibleCandles, setVisibleCandles] = useState([]);

  useEffect(() => {
    // Фильтруем активные свечи (не истекшие)
    const activeCandles = candles.filter(candle => {
      if (!candle.candleData?.expiresAt) return true;
      return new Date() < new Date(candle.candleData.expiresAt);
    });

    // Группируем свечи по типу
    const candleGroups = activeCandles.reduce((groups, candle) => {
      const candleType = candle.candleType || candle.itemId;
      const candleInfo = candlesDatabase.getById(candleType);
      
      if (!groups[candleType]) {
        groups[candleType] = {
          info: candleInfo,
          count: 0,
          candles: []
        };
      }
      
      groups[candleType].count++;
      groups[candleType].candles.push(candle);
      return groups;
    }, {});

    setVisibleCandles(Object.values(candleGroups));
  }, [candles]);

  if (visibleCandles.length === 0) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4',
    'center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
  };

  return (
    <div className={`${positionClasses[position]} z-40 pointer-events-none`}>
      <div className="flex flex-col space-y-2">
        {visibleCandles.map((candleGroup, index) => (
          <div key={index} className="flex items-center space-x-2 bg-black bg-opacity-20 rounded-lg p-2">
            <div className="text-2xl animate-pulse">
              🕯️
            </div>
            <div className="text-white text-sm">
              <div className="font-medium">{candleGroup.info?.name || 'Свеча памяти'}</div>
              {candleGroup.count > 1 && (
                <div className="text-xs opacity-75">x{candleGroup.count}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandlesDisplayFixed;

CandlesDisplayFixed.propTypes = {
  candles: PropTypes.arrayOf(PropTypes.object),
  position: PropTypes.oneOf([
    'bottom-right',
    'bottom-left',
    'top-right',
    'top-left',
    'center'
  ])
};
