import React, { useState } from 'react';

const ComplaintForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [type, setType] = useState('content');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit({ text, type });
      setText('');
      setType('content');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <label className="block mb-2 font-medium">Тип жалобы:</label>
      <select value={type} onChange={e => setType(e.target.value)} className="mb-2 px-2 py-1 border rounded">
        <option value="content">Контент</option>
        <option value="user">Пользователь</option>
        <option value="company">Компания</option>
      </select>
      <textarea
        className="w-full border rounded px-2 py-1 mb-2"
        rows={3}
        placeholder="Опишите проблему..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded">Отправить жалобу</button>
    </form>
  );
};

export default ComplaintForm;
