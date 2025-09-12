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
      <div
        className="flex flex-wrap gap-2 max-w-40"
        style={{
          minWidth: '80px',
          maxWidth: '160px',
          rowGap: '4px',
          columnGap: '8px',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
        }}
      >
        {activeItems.slice(0, 12).map((item, idx) => (
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
              pointerEvents: 'auto',
              margin: 0,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px',
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '50%',
              boxShadow: '0 1px 4px #0002',
            }}
            title={`${item.name || item.itemType || iconFallback} от ${item.authorName}${item.comment ? ': ' + item.comment : ''}`}
          >
            <span
              className="text-lg drop-shadow-lg filter"
              style={{
                color: item.color || '#888',
                textShadow: `0 0 8px ${(item.color || '#888')}40`,
                fontSize: '18px',
                lineHeight: '1',
                margin: 0,
                padding: 0,
              }}
            >
              {item.icon || iconFallback}
            </span>
          </div>
        ))}
        {activeItems.length > 12 && (
          <div className="text-xs font-semibold px-1 py-0.5 rounded-full bg-blue-500 text-white shadow-lg" style={{ fontSize: '10px' }}>
            +{activeItems.length - 12}
          </div>
        )}
      </div>
    </div>,
    avatarContainer
  );
};

export default VirtualItemsOnAvatar;
