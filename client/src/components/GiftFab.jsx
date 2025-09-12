import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { virtualItemsService } from '../services/virtualItems';

const availableGifts = [
  { id: 'teddy', name: 'Медвежонок', icon: '🧸', color: '#fbbf24', duration: 7 * 24 * 60 * 60 * 1000 },
  { id: 'heart', name: 'Сердце', icon: '❤️', color: '#ef4444', duration: 7 * 24 * 60 * 60 * 1000 },
  { id: 'star', name: 'Звезда', icon: '⭐', color: '#f59e42', duration: 7 * 24 * 60 * 60 * 1000 },
  { id: 'balloon', name: 'Шарик', icon: '🎈', color: '#38bdf8', duration: 7 * 24 * 60 * 60 * 1000 },
  { id: 'gift', name: 'Подарок', icon: '🎁', color: '#a78bfa', duration: 7 * 24 * 60 * 60 * 1000 }
];

const GiftFab = ({ memorialId, onGiftAdded }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [selectedGift, setSelectedGift] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddGift = async () => {
    if (!selectedGift) return;
    setLoading(true);
    try {
      await virtualItemsService.addItem('gift', memorialId, {
        icon: selectedGift.icon,
        name: selectedGift.name,
        color: selectedGift.color,
        duration: selectedGift.duration,
        comment: comment.trim()
      });
      setShowForm(false);
      setSelectedGift(null);
      setComment('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      if (onGiftAdded) onGiftAdded();
    } catch (e) {
      alert('Ошибка при добавлении подарка');
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-30 transform hover:scale-110 group"
        title="Добавить подарок"
      >
        <div className="flex items-center justify-center">
          <span className="text-2xl group-hover:animate-pulse">🎁</span>
        </div>
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Добавить подарок
        </div>
      </button>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border rounded shadow-lg p-4 z-20 w-80 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowForm(false)}>
              <span style={{fontSize: 20}}>&times;</span>
            </button>
            <div className="flex gap-2 mb-2">
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
              placeholder="Комментарий (необязательно)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button className="btn btn-primary btn-sm" onClick={handleAddGift} disabled={loading || !selectedGift}>
                Добавить
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎁</span>
            <span className="font-medium">Подарок добавлен!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default GiftFab;
