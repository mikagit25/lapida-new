import React from 'react';

const UserFriendsBlock = ({ user, onToggle, isOwner }) => (
  <div className="bg-white rounded shadow p-4">
    <div className="font-semibold mb-2">Друзья и родственники</div>
    <div>{Array.isArray(user.friends) && user.friends.length > 0 ? user.friends.map(f => f.name || f.email).join(', ') : 'Нет друзей'}</div>
    <div>{Array.isArray(user.relatives) && user.relatives.length > 0 ? 'Родственники: ' + user.relatives.map(r => r.name || r.email).join(', ') : ''}</div>
    {isOwner && <button className="mt-2 text-xs text-blue-600 underline" onClick={onToggle}>Скрыть блок</button>}
  </div>
);

export default UserFriendsBlock;
