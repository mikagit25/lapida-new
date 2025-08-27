import React, { useState } from 'react';

const CommentBox = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        className="w-full border rounded px-2 py-1 mb-2"
        rows={2}
        placeholder="Оставьте комментарий..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Отправить</button>
    </form>
  );
};

export default CommentBox;
