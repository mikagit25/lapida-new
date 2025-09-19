import React from 'react';

const DocumentForm = ({ form, onChange, onSubmit, loading, editId, onCancel, isOwner, t }) => {
  if (!isOwner) return null;
  return (
    <form onSubmit={onSubmit} className="document-form">
      <input name="title" value={form.title} onChange={onChange} placeholder={t('religiousOrgDocuments.title')} required />
      <textarea name="description" value={form.description} onChange={onChange} placeholder={t('religiousOrgDocuments.description')} />
      <input name="publishedAt" value={form.publishedAt} onChange={onChange} type="datetime-local" />
      <input name="fileUrl" value={form.fileUrl} onChange={onChange} placeholder={t('religiousOrgDocuments.fileUrl')} />
      <button type="submit" disabled={loading}>{editId ? t('common.save') : t('common.add')}</button>
      {editId && <button type="button" onClick={onCancel}>{t('common.cancel')}</button>}
    </form>
  );
};

export default DocumentForm;
