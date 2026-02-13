import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { virtualItemsService } from '../services/virtualItems';
import { useTranslation } from 'react-i18next';

const VirtualDoves = ({ memorialId, canEdit = false }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [doves, setDoves] = useState([]);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memorialId) loadDoves();
    // eslint-disable-next-line
  }, [memorialId]);

  const loadDoves = async () => {
    setLoading(true);
    const items = await virtualItemsService.getItems('dove', memorialId);
    setDoves(items);
    setLoading(false);
  };

  const handleAddDove = async () => {
    if (!user) {
      alert('Войдите, чтобы отпустить голубя');
      return;
    }
    if (!message.trim()) return;
    setLoading(true);
    try {
      await virtualItemsService.addItem('dove', memorialId, {
        comment: message,
        icon: '🕊️',
        name: 'Dove',
        color: '#60a5fa'
      });
      setMessage('');
      setShowForm(false);
      loadDoves();
    } catch (e) {
      console.error('Ошибка при добавлении голубя', e);
      alert('Ошибка при добавлении голубя');
    }
    setLoading(false);
  };

  return (
    <div className="virtual-doves-block my-4">
      <h3 className="font-semibold text-lg mb-2">{t('virtual_dove')}</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {doves.map((dove, idx) => (
          <span key={idx} title={dove.comment} style={{ fontSize: 28, color: '#60a5fa' }}>
            🕊️
            {dove.comment && (
              <span className="ml-2 text-xs text-gray-500">{dove.comment}</span>
            )}
            {dove.authorName && (
              <span className="ml-2 text-xs text-gray-400">— {dove.authorName}</span>
            )}
          </span>
        ))}
        {doves.length === 0 && !loading && (
          <span className="text-gray-400">{t('no_doves_yet') || 'No doves yet'}</span>
        )}
      </div>
      {canEdit && (
        <>
          {!showForm && (
            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowForm(true)}>
              {t('virtual_dove_add')}
            </button>
          )}
          {showForm && (
            <div className="virtual-dove-form mt-2 flex flex-col gap-2">
              <textarea
                className="form-textarea mt-1 block w-full border rounded"
                rows={2}
                placeholder={t('virtual_dove_placeholder')}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleAddDove} disabled={loading || !message.trim()}>
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

export default VirtualDoves;
