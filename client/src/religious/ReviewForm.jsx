import React from 'react';

const ReviewForm = ({ form, onChange, onSubmit, loading, editIndex, onCancel, isOwner, t }) => {
  if (!isOwner) return null;
  return (
    <form onSubmit={onSubmit} className="review-form">
      <input name="author" value={form.author} onChange={onChange} placeholder={t('religiousOrgReviews.author')} required />
      <input name="rating" value={form.rating} onChange={onChange} type="number" min="1" max="5" />
      <textarea name="text" value={form.text} onChange={onChange} placeholder={t('religiousOrgReviews.text')} />
      <input name="date" value={form.date} onChange={onChange} type="date" />
      <button type="submit" disabled={loading}>{editIndex !== null ? t('common.save') : t('common.add')}</button>
      {editIndex !== null && <button type="button" onClick={onCancel}>{t('common.cancel')}</button>}
    </form>
  );
};

export default ReviewForm;
