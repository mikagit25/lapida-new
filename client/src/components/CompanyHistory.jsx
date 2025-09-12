import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const CompanyHistory = ({ companyId, isOwner }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ date: '', title: '', description: '', image: null });
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/companies/${companyId}/history`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.history)) {
          setHistory(data.history);
        } else {
          setError(data.message || 'Ошибка загрузки истории');
        }
      } catch (e) {
        setError('Ошибка загрузки истории');
      }
      setLoading(false);
    }
    if (companyId) fetchHistory();
  }, [companyId]);

  const handleInputChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleAddStage = async e => {
    e.preventDefault();
    setUploadError('');
    if (!form.date || !form.title) {
      setUploadError('Заполните обязательные поля');
      return;
    }
    setAdding(true);
    try {
      const formData = new FormData();
      formData.append('date', form.date);
      formData.append('title', form.title);
      formData.append('description', form.description);
      if (form.image) formData.append('image', form.image);
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/companies/${companyId}/history`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка загрузки');
      setHistory(data.history || []);
      setForm({ date: '', title: '', description: '', image: null });
    } catch (e) {
      setUploadError(e.message || 'Ошибка загрузки');
    }
    setAdding(false);
  };

  const handleDeleteStage = async idx => {
    if (!window.confirm('Удалить этот этап?')) return;
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const res = await fetch(`${API_BASE_URL}/companies/${companyId}/history/${idx}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка удаления');
      setHistory(data.history || []);
    } catch (e) {
      alert(e.message || 'Ошибка удаления');
    }
  };

  if (loading) return <div className="text-gray-500">Загрузка истории...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">История компании</h2>
      {isOwner && (
        <form className="mb-8 bg-gray-50 p-4 rounded shadow" onSubmit={handleAddStage}>
          <div className="mb-2 font-semibold">Добавить этап</div>
          <input type="text" name="date" value={form.date} onChange={handleInputChange} placeholder="Дата" className="mb-2 px-3 py-2 border rounded w-full" required />
          <input type="text" name="title" value={form.title} onChange={handleInputChange} placeholder="Заголовок" className="mb-2 px-3 py-2 border rounded w-full" required />
          <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Описание" className="mb-2 px-3 py-2 border rounded w-full" />
          <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="mb-2" />
          {uploadError && <div className="text-red-600 mb-2">{uploadError}</div>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={adding}>{adding ? 'Загрузка...' : 'Добавить'}</button>
        </form>
      )}
      {!history.length && <div className="text-gray-500">История пока не добавлена.</div>}
      <div className="space-y-6">
        {history.map((stage, idx) => (
          <div key={idx} className="bg-white rounded shadow p-4 flex flex-col md:flex-row items-center gap-4">
            {stage.image && (
              <img src={stage.image} alt={stage.title || 'Этап'} className="w-32 h-32 object-cover rounded mb-2 md:mb-0" />
            )}
            <div className="flex-1">
              <div className="font-semibold mb-1">{stage.title}</div>
              <div className="text-xs text-gray-400 mb-1">{stage.date}</div>
              {stage.description && <div className="text-gray-600 text-sm mb-2">{stage.description}</div>}
              {isOwner && (
                <button onClick={() => handleDeleteStage(idx)} className="mt-2 text-xs text-red-600 hover:underline">Удалить</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyHistory;
