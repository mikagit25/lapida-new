import React from 'react';
import { createPortal } from 'react-dom';

// Универсальный компонент для отображения виртуальных предметов на аватаре
const VirtualItemsOnAvatar = ({ items = [], iconFallback = '🎁', side = 'right', type = 'gift' }) => {
  // Фильтруем только активные предметы (по времени жизни)
  const now = Date.now();
  const activeItems = items.filter(item => {
    const createdAt = new Date(item.createdAt).getTime();
    const expiresAt = createdAt + (item.duration || 7 * 24 * 60 * 60 * 1000);
    return now < expiresAt;
  });

  // Контейнер для портала
  const avatarContainer = document.getElementById('avatar-candles-container');
  if (!avatarContainer || activeItems.length === 0) return null;

  // Стили позиционирования (точно как у свечей/цветов)
  const posStyle = side === 'left'
    ? { left: '8px', bottom: '8px', position: 'absolute', zIndex: 999 }
    : { right: '8px', bottom: '8px', position: 'absolute', zIndex: 999 };

  return createPortal(
    <div style={posStyle} className="pointer-events-none">
      <div className="flex flex-wrap gap-1 max-w-16">
        {activeItems.slice(0, 6).map((item, idx) => (
          <div
            key={`${type}-${item._id || idx}`}
            className="relative transform transition-all duration-300"
            style={{
              animationName: 'candleFlicker',
              animationDuration: '2s',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationDirection: 'alternate',
              animationDelay: `${idx * 0.2}s`,
              pointerEvents: 'auto'
            }}
            title={`${item.name || item.itemType || iconFallback} от ${item.authorName}${item.comment ? ': ' + item.comment : ''}`}
          >
            <span
              className="text-lg drop-shadow-lg filter"
              style={{
                color: item.color || '#888',
                textShadow: `0 0 8px ${(item.color || '#888')}40`,
                fontSize: '18px',
                lineHeight: '1'
              }}
            >
              {item.icon || iconFallback}
            </span>
          </div>
        ))}
        {activeItems.length > 6 && (
          <div className="text-xs font-semibold px-1 py-0.5 rounded-full bg-blue-500 text-white shadow-lg" style={{ fontSize: '8px' }}>
            +{activeItems.length - 6}
          </div>
        )}
      </div>
    </div>,
    avatarContainer
  );
};

export default VirtualItemsOnAvatar;
