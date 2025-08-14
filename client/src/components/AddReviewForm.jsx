import React, { useState } from 'react';

function AddReviewForm({ companyId, onAdd }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/companies/${companyId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text, rating }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.reviews) {
        setSuccess(true);
        setText('');
        setRating(5);
        if (onAdd) onAdd();
      } else {
        setError(data.message || 'Ошибка добавления');
      }
    } catch (e) {
      setError('Ошибка добавления');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4 flex flex-col gap-2">
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Ваш отзыв" required className="border px-3 py-2 rounded" />
      <label className="text-sm font-medium">Оценка:
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="ml-2 border rounded px-2 py-1">
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Отзыв добавлен!</div>}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
        {loading ? 'Добавление...' : 'Добавить отзыв'}
      </button>
    </form>
  );
}

export default AddReviewForm;
