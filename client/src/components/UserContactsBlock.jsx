import React from 'react';

const UserContactsBlock = ({ user, onToggle, isOwner }) => (
  <div className="bg-white rounded shadow p-4">
    <div className="font-semibold mb-2">Контакты</div>
    <div>Email: {user.email || '—'}</div>
    <div>Телефон: {user.phone || '—'}</div>
    {isOwner && <button className="mt-2 text-xs text-blue-600 underline" onClick={onToggle}>Скрыть блок</button>}
  </div>
);

export default UserContactsBlock;
