import React, { useState } from 'react';

export default function CompanyReviewForm({ companyId, onReviewAdded }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Только зарегистрированные пользователи могут оставлять отзывы.');
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/companies/${companyId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ text, rating }),
      });
      const data = await res.json();
      if (res.ok && data.review) {
        setSuccess('Спасибо за ваш отзыв!');
        setText('');
        setRating(5);
        if (onReviewAdded) onReviewAdded(data.review);
      } else {
        setError(data.message || 'Ошибка отправки отзыва');
      }
    } catch (e) {
      setError('Ошибка отправки отзыва');
    }
    setLoading(false);
  };

  return (
    <form className="bg-gray-100 p-4 rounded mb-4" onSubmit={handleSubmit}>
      <div className="mb-2 font-semibold">Оставьте ваш отзыв:</div>
      <textarea
        className="border rounded w-full p-2 mb-2"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Ваш отзыв..."
        required
        minLength={5}
      />
      <div className="mb-2">
        <label className="mr-2">Оценка:</label>
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="border rounded px-2 py-1">
          {[5,4,3,2,1].map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">
        {loading ? 'Отправка...' : 'Оставить отзыв'}
      </button>
      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
      {success && <div className="text-green-600 mt-2 text-sm">{success}</div>}
    </form>
  );
}
