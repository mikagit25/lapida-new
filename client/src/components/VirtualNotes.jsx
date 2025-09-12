import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { virtualItemsService } from '../services/virtualItems';
import { useTranslation } from 'react-i18next';

const VirtualNotes = ({ memorialId, canEdit = false }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [notes, setNotes] = useState([]);
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memorialId) loadNotes();
    // eslint-disable-next-line
  }, [memorialId]);

  const loadNotes = async () => {
    setLoading(true);
    const items = await virtualItemsService.getItems('note', memorialId);
    setNotes(items);
    setLoading(false);
  };

  const handleAddNote = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      await virtualItemsService.addItem('note', memorialId, {
        comment: message
      });
      setMessage('');
      setShowForm(false);
      loadNotes();
    } catch (e) {
      alert('Ошибка при добавлении записки');
    }
    setLoading(false);
  };

  return (
    <div className="virtual-notes-block my-4">
      <h3 className="font-semibold text-lg mb-2">{t('virtual_note')}</h3>
      <div className="flex flex-col gap-1 mb-2">
        {notes.map((note, idx) => (
          <div key={idx} className="bg-yellow-50 rounded p-2 text-gray-700 text-sm">
            <span role="img" aria-label="note">📝</span> {note.comment}
            {note.authorName && (
              <span className="ml-2 text-xs text-gray-400">— {note.authorName}</span>
            )}
          </div>
        ))}
        {notes.length === 0 && !loading && (
          <span className="text-gray-400">{t('no_notes_yet') || 'No notes yet'}</span>
        )}
      </div>
      {canEdit && (
        <>
          {!showForm && (
            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowForm(true)}>
              {t('virtual_note_add')}
            </button>
          )}
          {showForm && (
            <div className="virtual-note-form mt-2 flex flex-col gap-2">
              <textarea
                className="form-textarea mt-1 block w-full border rounded"
                rows={2}
                placeholder={t('virtual_note_placeholder')}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <div className="flex gap-2">
                <button className="btn btn-primary btn-sm" onClick={handleAddNote} disabled={loading || !message.trim()}>
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

export default VirtualNotes;
