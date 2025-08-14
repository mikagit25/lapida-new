import React, { useState } from 'react';

function AddDocumentForm({ companyId, onAdd }) {
  const [form, setForm] = useState({ name: '', url: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/companies/${companyId}/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.documents) {
        setSuccess(true);
        setForm({ name: '', url: '' });
        if (onAdd) onAdd();
      } else {
        setError(data.message || 'Ошибка добавления');
      }
    } catch (e) {
      setError('Ошибка добавления');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4 flex flex-col gap-2">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Название документа" required className="border px-3 py-2 rounded" />
      <input name="url" value={form.url} onChange={handleChange} placeholder="Ссылка на документ (URL)" required className="border px-3 py-2 rounded" />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
        {loading ? 'Загрузка...' : 'Добавить документ'}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Документ добавлен!</div>}
    </form>
  );
}

export default AddDocumentForm;
