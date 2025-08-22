import React from 'react';


const UserStatsBlock = ({ user, onToggle, isOwner }) => (
  <div className="bg-white rounded shadow p-4">
    <div className="font-semibold mb-2">Статистика</div>
    <div>Мемориалов: {user.memorialsCreated ?? user.stats?.memorials ?? user.memorials?.length ?? 0}</div>
    <div>Цветов: {user.flowersLeft ?? user.stats?.flowersLeft ?? 0}</div>
    <div>Комментариев: {user.commentsLeft ?? user.stats?.commentsLeft ?? 0}</div>
    {isOwner && <button className="mt-2 text-xs text-blue-600 underline" onClick={onToggle}>Скрыть блок</button>}
  </div>
);

export default UserStatsBlock;
