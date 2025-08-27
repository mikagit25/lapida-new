import React, { useState } from 'react';

const ComplaintForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [type, setType] = useState('content');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ text, type });
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="complaint-form">
      <label>
        Тип жалобы:
        <select value={type} onChange={e => setType(e.target.value)}>
          <option value="content">Контент</option>
          <option value="user">Пользователь</option>
          <option value="company">Компания</option>
        </select>
      </label>
      <textarea
        placeholder="Опишите проблему..."
        value={text}
        onChange={e => setText(e.target.value)}
        required
      />
      <button type="submit">Отправить жалобу</button>
    </form>
  );
};

export default ComplaintForm;
