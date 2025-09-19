import React from 'react';

const GalleryForm = ({ form, onChange, onPhotoChange, onSubmit, loading, editId, onCancel, isOwner, t }) => {
  if (!isOwner) return null;
  return (
    <form onSubmit={onSubmit} className="gallery-form">
      <input name="title" value={form.title} onChange={onChange} placeholder={t('religiousOrgGallery.title')} required />
      <textarea name="description" value={form.description} onChange={onChange} placeholder={t('religiousOrgGallery.description')} />
      <input type="file" multiple accept="image/*" onChange={onPhotoChange} />
      <button type="submit" disabled={loading}>{editId ? t('common.save') : t('common.add')}</button>
      {editId && <button type="button" onClick={onCancel}>{t('common.cancel')}</button>}
    </form>
  );
};

export default GalleryForm;
