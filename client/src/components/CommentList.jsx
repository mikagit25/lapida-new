import React from 'react';

const CommentList = ({ comments }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-lg font-semibold mb-4">Комментарии</h2>
    {comments.length === 0 ? (
      <div className="text-gray-500">Нет комментариев для отображения.</div>
    ) : (
      <ul className="space-y-3">
        {comments.map((c, idx) => (
          <li key={c._id || idx} className="border-b pb-2">
            <div className="text-gray-700 mt-1">{c.text}</div>
            <div className="text-gray-500 text-xs">{c.date}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default CommentList;
