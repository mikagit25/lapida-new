import React from 'react';

const NewsForm = ({ form, onChange, onSubmit, loading, editId, onCancel, isOwner, t }) => {
  if (!isOwner) return null;
  return (
    <form onSubmit={onSubmit} className="news-form">
      <input name="title" value={form.title} onChange={onChange} placeholder={t('religiousOrgNews.title')} required />
      <textarea name="text" value={form.text} onChange={onChange} placeholder={t('religiousOrgNews.text')} />
      <input name="publishedAt" value={form.publishedAt} onChange={onChange} type="datetime-local" />
      <input name="images" value={form.images} onChange={onChange} placeholder={t('religiousOrgNews.images')} />
      <button type="submit" disabled={loading}>{editId ? t('common.save') : t('common.add')}</button>
      {editId && <button type="button" onClick={onCancel}>{t('common.cancel')}</button>}
    </form>
  );
};

export default NewsForm;
