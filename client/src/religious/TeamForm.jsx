import React from 'react';

const TeamForm = ({ form, onChange, onSubmit, loading, editId, onCancel, isOwner, t }) => {
  if (!isOwner) return null;
  return (
    <form onSubmit={onSubmit} className="team-form">
      <input name="name" value={form.name} onChange={onChange} placeholder={t('religiousOrgTeam.name')} required />
      <input name="position" value={form.position} onChange={onChange} placeholder={t('religiousOrgTeam.position')} />
      <textarea name="description" value={form.description} onChange={onChange} placeholder={t('religiousOrgTeam.description')} />
      <input name="contacts" value={form.contacts} onChange={onChange} placeholder={t('religiousOrgTeam.contacts')} />
      <input name="photo" value={form.photo} onChange={onChange} placeholder={t('religiousOrgTeam.photo')} />
      <button type="submit" disabled={loading}>{editId ? t('common.save') : t('common.add')}</button>
      {editId && <button type="button" onClick={onCancel}>{t('common.cancel')}</button>}
    </form>
  );
};

export default TeamForm;
