import React from 'react';

const GalleryListItem = ({ album, idx, isOwner, onEdit, onDelete, t }) => (
  <li key={album._id || idx}>
    <b>{album.title}</b> — {album.description}
    {album.photos && album.photos.length > 0 && (
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        {album.photos.map((photo, i) => (
          <img key={i} src={photo} alt={album.title} style={{ maxWidth: 60, maxHeight: 60, borderRadius: 4 }} />
        ))}
      </div>
    )}
    {isOwner && (
      <>
        <button onClick={() => onEdit(idx)}>{t('common.edit')}</button>
        <button onClick={() => onDelete(idx)}>{t('common.delete')}</button>
      </>
    )}
  </li>
);

export default GalleryListItem;
