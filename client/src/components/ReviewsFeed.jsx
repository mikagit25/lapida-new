import React, { useState } from 'react';

export default function ReviewsFeed({ reviews }) {
  const [expanded, setExpanded] = useState(false);
  if (!reviews || reviews.length === 0) return null;
  const shown = expanded ? reviews : reviews.slice(-2);
  return (
    <div className="space-y-4">
      {shown.map(r => (
        <div key={r._id} className="bg-white rounded shadow p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold">{r.userName || 'Пользователь'}</span>
            <span className="text-yellow-500">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
          </div>
          <div className="text-gray-700 mb-1">{r.text}</div>
          <div className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</div>
        </div>
      ))}
      {reviews.length > 2 && !expanded && (
        <button className="text-blue-600 underline text-sm" onClick={() => setExpanded(true)}>
          Показать все отзывы
        </button>
      )}
      {expanded && reviews.length > 2 && (
        <button className="text-blue-600 underline text-sm" onClick={() => setExpanded(false)}>
          Свернуть отзывы
        </button>
      )}
    </div>
  );
}
