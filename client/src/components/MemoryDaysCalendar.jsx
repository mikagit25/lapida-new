import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

const MemoryDaysCalendar = () => {
  const [days, setDays] = useState([]);
  const [newDay, setNewDay] = useState({ date: '', title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  const fetchDays = () => {
    apiFetch(`${API_BASE_URL}/memory-days`)
      .then(res => res.json())
      .then(data => {
        setDays(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка загрузки дней памяти');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDays();
  }, []);

  const handleChange = e => {
    setNewDay({ ...newDay, [e.target.name]: e.target.value });
  };

  const handleAdd = async e => {
    e.preventDefault();
    if (!newDay.date || !newDay.title) return;
    setAdding(true);
    try {
      await apiFetch(`${API_BASE_URL}/memory-days`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDay)
      });
      setNewDay({ date: '', title: '', description: '' });
      fetchDays();
    } catch {
      setError('Ошибка добавления дня памяти');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div>Загрузка дней памяти...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-6 flex gap-2 flex-wrap">
        <input type="date" name="date" value={newDay.date} onChange={handleChange} className="border rounded px-2 py-1" required />
        <input type="text" name="title" value={newDay.title} onChange={handleChange} className="border rounded px-2 py-1" placeholder="Название" required />
        <input type="text" name="description" value={newDay.description} onChange={handleChange} className="border rounded px-2 py-1" placeholder="Описание" />
        <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded" disabled={adding}>
          {adding ? 'Добавление...' : 'Добавить'}
        </button>
      </form>
      <div className="grid grid-cols-1 gap-4">
        {days.map(day => (
          <div key={day.id} className="border rounded p-4 bg-white shadow">
            <div className="font-semibold text-lg mb-1">{day.title}</div>
            <div className="text-gray-700 mb-1">{day.date}</div>
            <div className="text-gray-500">{day.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryDaysCalendar;
