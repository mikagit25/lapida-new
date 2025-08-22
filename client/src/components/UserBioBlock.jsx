import React from 'react';


const UserBioBlock = ({ user, onToggle, isOwner }) => (
  <div className="bg-white rounded shadow p-4">
    <div className="font-semibold mb-2">О себе</div>
    <div className="text-gray-700 whitespace-pre-wrap">{user.bio || user.biography || 'Нет информации'}</div>
    {isOwner && <button className="mt-2 text-xs text-blue-600 underline" onClick={onToggle}>Скрыть блок</button>}
  </div>
);

export default UserBioBlock;
