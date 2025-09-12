import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { virtualItemsService } from '../services/virtualItems';
import { useTranslation } from 'react-i18next';

const availableGifts = [
  { id: 'teddy', name: 'Teddy Bear', icon: '🧸', color: '#fbbf24' },
  { id: 'heart', name: 'Heart', icon: '❤️', color: '#ef4444' },
  { id: 'star', name: 'Star', icon: '⭐', color: '#f59e42' },
  { id: 'balloon', name: 'Balloon', icon: '🎈', color: '#38bdf8' },
  { id: 'gift', name: 'Gift Box', icon: '🎁', color: '#a78bfa' }
];

const VirtualGifts = ({ memorialId, canEdit = false }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memorialId) loadGifts();
    // eslint-disable-next-line
  }, [memorialId]);

  const loadGifts = async () => {
    setLoading(true);
    const items = await virtualItemsService.getItems('gift', memorialId);
    setGifts(items);
    setLoading(false);
  };

  const handleAddGift = async () => {
    if (!selectedGift) return;
    setLoading(true);
    try {
      await virtualItemsService.addItem('gift', memorialId, {
        icon: selectedGift.icon,
        name: selectedGift.name,
        color: selectedGift.color,
        comment: message
      });
      setMessage('');
      setSelectedGift(null);
      setShowForm(false);
      loadGifts();
    } catch (e) {
      alert('Ошибка при добавлении подарка');
    }
    setLoading(false);
  };

  return (
    <div className="virtual-gifts-block my-4">
      <h3 className="font-semibold text-lg mb-2">{t('virtual_gift')}</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {gifts.map((gift, idx) => (
          <span key={idx} title={gift.name} style={{ fontSize: 28, color: gift.color }}>
            {gift.icon}
          </span>
        ))}
        {gifts.length === 0 && !loading && (
          <span className="text-gray-400">{t('no_gifts_yet') || 'No gifts yet'}</span>
        )}
      </div>
      {canEdit && (
        <>
          {!showForm && (
            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowForm(true)}>
              {t('virtual_gift_add')}
            </button>
          )}
          {showForm && (
            <div className="virtual-gift-form mt-2 flex flex-col gap-2">
              <div className="flex gap-2">
                {availableGifts.map(gift => (
                  <button
                    key={gift.id}
                    type="button"
                    className={`rounded p-2 border ${selectedGift?.id === gift.id ? 'border-blue-500' : 'border-gray-300'}`}
                    style={{ background: selectedGift?.id === gift.id ? '#e0e7ff' : '#fff' }}
                    onClick={() => setSelectedGift(gift)}
                  >
                    <span style={{ fontSize: 24, color: gift.color }}>{gift.icon}</span>
                  </button>
                ))}
              </div>
              <textarea
                className="form-textarea mt-1 block w-full border rounded"
                rows={2}
                placeholder={t('virtual_gift_placeholder')}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleAddGift} disabled={loading || !selectedGift}>
                  {t('add') || 'Add'}
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>
                  {t('cancel') || 'Cancel'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VirtualGifts;
