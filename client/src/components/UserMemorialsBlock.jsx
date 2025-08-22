import React from 'react';


const UserMemorialsBlock = ({ user, onToggle, isOwner }) => (
  <div className="bg-white rounded shadow p-4">
    <div className="font-semibold mb-2">Мемориалы пользователя</div>
    <div className="space-y-2">
      {Array.isArray(user.memorials) && user.memorials.length > 0 ? (
        user.memorials.map(m => (
          <div key={m._id || m.title} className="flex items-center gap-3 border-b pb-2">
            {m.photo && <img src={m.photo} alt="Фото" className="w-10 h-10 object-cover rounded" />}
            <div>
              <div className="font-semibold">{m.title || 'Без названия'}</div>
              {m.date && <div className="text-xs text-gray-500">{m.date}</div>}
              {/* Если есть slug или id, можно сделать ссылку */}
              {(m.customSlug || m._id) && (
                <a href={m.customSlug ? `/memorial/${m.customSlug}` : `/memorial/${m._id}`} className="text-blue-600 underline text-xs" target="_blank" rel="noopener noreferrer">Открыть</a>
              )}
            </div>
          </div>
        ))
      ) : 'Нет мемориалов'}
    </div>
    {isOwner && <button className="mt-2 text-xs text-blue-600 underline" onClick={onToggle}>Скрыть блок</button>}
  </div>
);

export default UserMemorialsBlock;
