import React, { useState, useEffect } from 'react';
import ComplaintForm from './ComplaintForm';
import ComplaintList from './ComplaintList';
import { apiFetch } from '../services/apiFetch';

const ComplaintManager = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/complaints');
      const data = await res.json();
      setComplaints(data.complaints || []);
      setError('');
    } catch (e) {
      console.error('Ошибка загрузки жалоб', e);
      setError('Ошибка загрузки жалоб');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (complaint) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(complaint)
      });
      if (res.ok) {
        fetchComplaints();
      }
    } catch (e) {
      console.error('Ошибка отправки жалобы', e);
      setError('Ошибка отправки жалобы');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Жалобы и модерация</h1>
      <ComplaintForm onSubmit={handleSubmit} />
      {loading && <div>Загрузка...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <ComplaintList complaints={complaints} />
    </div>
  );
};

export default ComplaintManager;
