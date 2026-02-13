import React, { useState } from 'react';

export default function NoteFab({ memorialId, onNoteAdded }) {
  void memorialId;
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setLoading(true);
    // TODO: Replace with actual API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setShowModal(false);
      setNote('');
      if (onNoteAdded) onNoteAdded();
      setTimeout(() => setSuccess(false), 2000);
    }, 1000);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-52 right-6 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 z-30 transform hover:scale-110 group"
        title="Оставить записку памяти"
      >
        <div className="flex items-center justify-center">
          <span className="text-2xl group-hover:animate-pulse">📝</span>
        </div>
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Оставить записку
        </div>
      </button>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Оставить записку памяти</h3>
            <textarea
              className="w-full border rounded p-2 mb-4"
              rows={4}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Введите текст записки..."
              disabled={loading}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Отмена</button>
              <button onClick={handleAddNote} className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" disabled={loading || !note.trim()}>
                {loading ? 'Отправка...' : 'Оставить'}
              </button>
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className="fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300">
          Записка успешно добавлена!
        </div>
      )}
    </>
  );
}
