import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

const CommentBox = ({ itemId, onComment }) => {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_BASE_URL}/social/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, text })
    });
    setText('');
    if (onComment) onComment();
  };

  return (
    <form onSubmit={handleSubmit} className="comment-box">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Ваш комментарий..."
        required
      />
      <button type="submit">Отправить</button>
    </form>
  );
};

export default CommentBox;
