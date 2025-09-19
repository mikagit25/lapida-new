import React from 'react';

const ScheduleForm = ({ form, onChange, onSubmit, loading, editId, onCancel, isOwner, t }) => {
  if (!isOwner) return null;
  return (
    <form onSubmit={onSubmit} className="schedule-form">
      <input name="title" value={form.title} onChange={onChange} placeholder={t('religiousOrgSchedule.title')} required />
      <textarea name="description" value={form.description} onChange={onChange} placeholder={t('religiousOrgSchedule.description')} />
      <input name="date" value={form.date} onChange={onChange} type="date" required />
      <input name="time" value={form.time} onChange={onChange} type="time" required />
      <input name="type" value={form.type} onChange={onChange} placeholder={t('religiousOrgSchedule.type')} />
      <input name="location" value={form.location} onChange={onChange} placeholder={t('religiousOrgSchedule.location')} />
      <button type="submit" disabled={loading}>{editId ? t('common.save') : t('common.add')}</button>
      {editId && <button type="button" onClick={onCancel}>{t('common.cancel')}</button>}
    </form>
  );
};

export default ScheduleForm;
