import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { virtualItemsService } from '../services/virtualItems';
import { useTranslation } from 'react-i18next';

const VirtualPrayers = ({ memorialId, canEdit = false }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [prayers, setPrayers] = useState([]);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memorialId) loadPrayers();
    // eslint-disable-next-line
  }, [memorialId]);

  const loadPrayers = async () => {
    setLoading(true);
    const items = await virtualItemsService.getItems('prayer', memorialId);
    setPrayers(items);
    setLoading(false);
  };

  const handleAddPrayer = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await virtualItemsService.addItem('prayer', memorialId, {
        comment: message
      });
      setMessage('');
      setShowForm(false);
      loadPrayers();
    } catch (e) {
      alert('Ошибка при добавлении молитвы');
    }
    setLoading(false);
  };

  return (
    <div className="virtual-prayers-block my-4">
      <h3 className="font-semibold text-lg mb-2">{t('virtual_prayer')}</h3>
      <div className="flex flex-col gap-1 mb-2">
        {prayers.map((prayer, idx) => (
          <div key={idx} className="bg-gray-100 rounded p-2 text-gray-700 text-sm">
            <span role="img" aria-label="prayer">🙏</span> {prayer.comment}
            {prayer.authorName && (
              <span className="ml-2 text-xs text-gray-400">— {prayer.authorName}</span>
            )}
          </div>
        ))}
        {prayers.length === 0 && !loading && (
          <span className="text-gray-400">{t('no_prayers_yet') || 'No prayers yet'}</span>
        )}
      </div>
      {canEdit && (
        <>
          {!showForm && (
            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowForm(true)}>
              {t('virtual_prayer_add')}
            </button>
          )}
          {showForm && (
            <div className="virtual-prayer-form mt-2 flex flex-col gap-2">
              <textarea
                className="form-textarea mt-1 block w-full border rounded"
                rows={2}
                placeholder={t('virtual_prayer_placeholder')}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleAddPrayer} disabled={loading || !message.trim()}>
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

export default VirtualPrayers;
