import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/apiFetch';
import Timeline from './Timeline';

const TimelineManager = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/timeline-events');
      const data = await res.json();
      setEvents(data.events || []);
      setError('');
    } catch (e) {
      setError('Ошибка загрузки событий');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Хронология и события</h1>
      {loading && <div>Загрузка...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <Timeline events={events} />
    </div>
  );
};

export default TimelineManager;
