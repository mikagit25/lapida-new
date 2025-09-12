import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { virtualItemsService } from '../services/virtualItems';

const PrayerFab = ({ memorialId, onPrayerAdded }) => {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddPrayer = async () => {
    setLoading(true);
    try {
      await virtualItemsService.addItem('prayer', memorialId, {
        icon: '🙏',
        name: 'Молитва',
        color: '#6366f1',
        comment: comment.trim()
      });
      setShowForm(false);
      setComment('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      if (onPrayerAdded) onPrayerAdded();
    } catch (e) {
      alert('Ошибка при добавлении молитвы');
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="bg-gradient-to-r from-indigo-400 to-indigo-600 hover:from-indigo-500 hover:to-indigo-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-30 transform hover:scale-110 group"
        title="Добавить молитву"
      >
        <div className="flex items-center justify-center">
          <span className="text-2xl group-hover:animate-pulse">🙏</span>
        </div>
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Добавить молитву
        </div>
      </button>
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white border rounded shadow-lg p-4 z-20 w-80 relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowForm(false)}>
              <span style={{fontSize: 20}}>&times;</span>
            </button>
            <textarea
              className="form-textarea mt-1 block w-full border rounded"
              rows={2}
              placeholder="Комментарий (необязательно)"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button className="btn btn-primary btn-sm" onClick={handleAddPrayer} disabled={loading}>
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
        <div className="fixed top-4 right-4 bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="text-lg">🙏</span>
            <span className="font-medium">Молитва добавлена!</span>
          </div>
        </div>
      )}
    </>
  );
};

export default PrayerFab;
