import React from 'react';


const UserAvatarBlock = ({ user, onToggle, isOwner }) => (
  <div className="bg-white rounded shadow p-4 flex items-center gap-4">
    <img src={user.avatar || '/default-avatar.png'} alt="Аватар" className="w-20 h-20 rounded-full object-cover border" />
    <div>
      <div className="font-bold text-lg">{user.name || 'Пользователь'}</div>
      {(user.firstName || user.lastName) && (
        <div className="text-gray-700 text-base">{user.firstName} {user.lastName}</div>
      )}
      {isOwner && <button className="ml-2 text-xs text-blue-600 underline" onClick={onToggle}>Скрыть блок</button>}
    </div>
  </div>
);

export default UserAvatarBlock;
