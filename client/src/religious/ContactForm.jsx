import React from 'react';

const ContactForm = ({ form, onChange, onSubmit, loading, editId, onCancel, isOwner, t }) => {
  if (!isOwner) return null;
  return (
    <form onSubmit={onSubmit} className="contact-form">
      <input name="type" value={form.type} onChange={onChange} placeholder={t('religiousOrgContacts.type')} required />
      <input name="value" value={form.value} onChange={onChange} placeholder={t('religiousOrgContacts.value')} required />
      <button type="submit" disabled={loading}>{editId ? t('common.save') : t('common.add')}</button>
      {editId && <button type="button" onClick={onCancel}>{t('common.cancel')}</button>}
    </form>
  );
};

export default ContactForm;
