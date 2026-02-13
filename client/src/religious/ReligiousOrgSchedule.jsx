// Компонент расписания церкви (службы, события)
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import religiousScheduleService from '../services/religiousScheduleService';
import ScheduleForm from './ScheduleForm';
import ScheduleListItem from './ScheduleListItem';

const initialEvent = { title: '', description: '', date: '', time: '', type: 'service', location: '' };

const ReligiousOrgSchedule = ({ orgId, isOwner }) => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState(initialEvent);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    religiousScheduleService.getByOrganization(orgId)
      .then(setEvents)
      .catch((err) => {
        console.error('Ошибка загрузки расписания релорганизации:', err);
        setError(t('religiousOrgSchedule.loadError'));
      })
      .finally(() => setLoading(false));
  }, [orgId, t]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let event;
      if (editId) {
        event = await religiousScheduleService.update(editId, { ...form, organization: orgId });
        setEvents(events.map(ev => (ev._id === editId ? event : ev)));
        setEditId(null);
      } else {
        event = await religiousScheduleService.create({ ...form, organization: orgId });
        setEvents([...events, event]);
      }
      setForm(initialEvent);
    } catch (err) {
      console.error('Ошибка сохранения события релорганизации:', err);
      setError(t('religiousOrgSchedule.saveError'));
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      await religiousScheduleService.remove(id);
      setEvents(events.filter(ev => ev._id !== id));
      if (editId === id) setEditId(null);
    } catch (err) {
      console.error('Ошибка удаления события релорганизации:', err);
      setError(t('religiousOrgSchedule.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ev) => {
    setForm({
      title: ev.title,
      description: ev.description,
      date: ev.date ? ev.date.slice(0, 10) : '',
      time: ev.time || '',
      type: ev.type || 'service',
      location: ev.location || ''
    });
    setEditId(ev._id);
  };

  return (
    <section>
      <h2>{t('religiousOrgSchedule.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ScheduleForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        editId={editId}
        onCancel={() => { setForm(initialEvent); setEditId(null); }}
        isOwner={isOwner}
        t={t}
      />
      <ul className="schedule-list">
        {events.map((ev, idx) => (
          <ScheduleListItem
            key={ev._id || idx}
            event={ev}
            idx={idx}
            isOwner={isOwner}
            onEdit={() => handleEdit(ev)}
            onDelete={() => handleDelete(ev._id)}
            t={t}
          />
        ))}
      </ul>
    </section>
  );
};

export default ReligiousOrgSchedule;
