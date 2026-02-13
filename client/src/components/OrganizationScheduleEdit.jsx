import React, { useState } from 'react';

const emptyEvent = { title: '', date: '', description: '' };

const OrganizationScheduleEdit = ({ schedule = [], onSave }) => {
  const [events, setEvents] = useState(schedule);
  const [newEvent, setNewEvent] = useState(emptyEvent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addEvent = () => {
    if (newEvent.title.trim()) {
      setEvents([...events, newEvent]);
      setNewEvent(emptyEvent);
    }
  };

  const removeEvent = idx => {
    setEvents(events.filter((_, i) => i !== idx));
  };

  const handleChange = e => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await onSave(events);
      setSuccess(true);
    } catch (err) {
      console.error('Ошибка сохранения расписания', err);
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">Расписание</h2>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input name="title" value={newEvent.title} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Название события" />
        <input name="date" value={newEvent.date} onChange={handleChange} type="date" className="border rounded px-3 py-2" />
        <input name="description" value={newEvent.description} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Описание" />
        <button type="button" onClick={addEvent} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Добавить</button>
      </div>
      <ul className="divide-y divide-gray-200 mb-4">
        {events.map((ev, i) => (
          <li key={i} className="py-2 flex items-center gap-2">
            <div className="flex-1">
              <div className="font-semibold">{ev.title} {ev.date && (<span className="text-gray-500 text-sm">({ev.date})</span>)}</div>
              <div className="text-gray-600 text-sm">{ev.description}</div>
            </div>
            <button type="button" onClick={() => removeEvent(i)} className="bg-red-600 text-white rounded px-2 py-1 text-xs">✕</button>
          </li>
        ))}
      </ul>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Сохранено!</div>}
      <button type="button" onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold">
        {saving ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
    </div>
  );
};

export default OrganizationScheduleEdit;
