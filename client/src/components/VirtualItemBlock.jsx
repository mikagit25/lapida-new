import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { virtualItemsService } from '../services/virtualItems';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';

// FAB style
const fabStyle = {
  position: 'absolute',
  bottom: 16,
  right: 16,
  zIndex: 10
};

function getRemainingTime(createdAt, duration) {
  if (!createdAt || !duration) return '';
  const end = new Date(createdAt).getTime() + duration;
  const now = Date.now();
  const diff = end - now;
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return days > 0 ? `${days}d ${hours}h` : `${hours}h`;
}

const VirtualItemBlock = ({
  type,
  memorialId,
  canEdit = false,
  availableItems = [],
  titleKey,
  addKey,
  placeholderKey,
  noItemsKey,
  icon = null
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memorialId) loadItems();
    // eslint-disable-next-line
  }, [memorialId]);

  const loadItems = async () => {
    setLoading(true);
    const fetched = await virtualItemsService.getItems(type, memorialId);
    setItems(fetched);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (availableItems.length && !selectedItem) return;
    if (!user?._id) {
      alert('Пожалуйста, войдите в систему');
      return;
    }
    setLoading(true);
    try {
      await virtualItemsService.addItem(type, memorialId, {
        icon: selectedItem?.icon || icon || '',
        name: selectedItem?.name || '',
        color: selectedItem?.color || '',
        comment: message
      });
      setMessage('');
      setSelectedItem(null);
      setShowForm(false);
      loadItems();
    } catch (err) {
      console.error('Ошибка при добавлении виртуального предмета:', err);
      alert('Ошибка при добавлении');
    }
    setLoading(false);
  };

  return (
    <div className="virtual-item-block my-4 relative bg-white rounded shadow p-4">
      <h3 className="font-semibold text-lg mb-2">{t(titleKey)}</h3>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[40px]">
        {items.slice(0, 6).map((item, idx) => {
          const timeLeft = getRemainingTime(item.createdAt, item.duration);
          return (
            <div key={idx} className="relative group" title={item.comment || ''}>
              <span
                style={{
                  fontSize: 28,
                  color: item.color || '#888',
                  filter: `drop-shadow(0 0 8px ${(item.color || '#888')}40)`
                }}
                className="transition-transform duration-200 group-hover:scale-110 group-hover:animate-pulse"
              >
                {item.icon || icon}
              </span>
              {timeLeft && (
                <span className="absolute -top-2 -right-2 text-[10px] text-blue-400 bg-white bg-opacity-80 px-1 rounded shadow">
                  {timeLeft}
                </span>
              )}
            </div>
          );
        })}
        {items.length > 6 && (
          <div 
            className="text-xs font-semibold px-1 py-0.5 rounded-full bg-blue-500 text-white shadow-lg"
            style={{ fontSize: '8px' }}
          >
            +{items.length - 6}
          </div>
        )}
        {items.length === 0 && !loading && (
          <span className="text-gray-400">{t(noItemsKey) || 'No items yet'}</span>
        )}
      </div>
      {canEdit && (
        <>
          {!showForm && (
            <button
              className="fixed md:absolute btn btn-primary rounded-full shadow-lg flex items-center justify-center"
              style={fabStyle}
              onClick={() => setShowForm(true)}
              title={t(addKey)}
            >
              {icon || (selectedItem && selectedItem.icon) || '+'}
            </button>
          )}
          {showForm && createPortal(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 virtual-item-modal animate-fade-in">
              <div className="virtual-item-form bg-white border rounded shadow-lg p-4 z-20 w-80 relative">
                <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowForm(false)}>
                  <span style={{fontSize: 20}}>&times;</span>
                </button>
                {availableItems.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {availableItems.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        className={`rounded p-2 border ${selectedItem?.id === item.id ? 'border-blue-500' : 'border-gray-300'}`}
                        style={{ background: selectedItem?.id === item.id ? '#e0e7ff' : '#fff' }}
                        onClick={() => setSelectedItem(item)}
                      >
                        <span style={{ fontSize: 24, color: item.color }}>{item.icon}</span>
                      </button>
                    ))}
                  </div>
                )}
                <textarea
                  className="form-textarea mt-1 block w-full border rounded"
                  rows={2}
                  placeholder={t(placeholderKey)}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={loading || (availableItems.length > 0 && !selectedItem)}>
                    {t('add') || 'Add'}
                  </button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>
                    {t('cancel') || 'Cancel'}
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
};

export default VirtualItemBlock;
