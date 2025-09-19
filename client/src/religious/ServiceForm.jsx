import React from 'react';

const ServiceForm = ({ form, onChange, onSubmit, loading, editIndex, onCancel, isOwner, t }) => {
  if (!isOwner) return null;
  return (
    <form onSubmit={onSubmit} className="service-form">
      <input name="name" value={form.name} onChange={onChange} placeholder={t('religiousOrgServices.name')} required />
      <textarea name="description" value={form.description} onChange={onChange} placeholder={t('religiousOrgServices.description')} />
      <input name="price" value={form.price} onChange={onChange} type="number" min="0" />
      <label>
        <input name="available" type="checkbox" checked={form.available} onChange={onChange} /> {t('religiousOrgServices.available')}
      </label>
      <button type="submit" disabled={loading}>{editIndex !== null ? t('common.save') : t('common.add')}</button>
      {editIndex !== null && <button type="button" onClick={onCancel}>{t('common.cancel')}</button>}
    </form>
  );
};

export default ServiceForm;
