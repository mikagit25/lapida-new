import React from 'react';

const UserGalleryBlock = ({ user, onToggle, isOwner }) => (
  <div className="bg-white rounded shadow p-4">
    <div className="font-semibold mb-2">Галерея</div>
    <div className="flex gap-2 flex-wrap">
      {Array.isArray(user.gallery) && user.gallery.length > 0 ? user.gallery.map((img, i) => (
        <img key={i} src={img} alt="Фото" className="w-16 h-16 object-cover rounded border" />
      )) : 'Нет фотографий'}
    </div>
    {isOwner && <button className="mt-2 text-xs text-blue-600 underline" onClick={onToggle}>Скрыть блок</button>}
  </div>
);

export default UserGalleryBlock;
