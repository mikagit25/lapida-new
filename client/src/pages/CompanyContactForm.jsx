import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const CompanyContactForm = () => {
  const { companySlug } = useParams();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSending(true);
    setError('');
    setSuccess('');
    try {
      const res1 = await fetch(`${API_BASE_URL}/companies/by-slug/${companySlug}`);
      const data1 = await res1.json();
      if (!res1.ok || !data1.company || !data1.company._id) throw new Error('Компания не найдена');
      const res = await fetch(`${API_BASE_URL}/companies/${data1.company._id}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка отправки');
      setSuccess('Сообщение отправлено!');
      setForm({ name: '', email: '', message: '' });
    } catch (e) {
      setError(e.message || 'Ошибка отправки');
    }
    setSending(false);
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Связаться с компанией</h1>
      <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded shadow">
        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ваше имя" className="mb-2 px-3 py-2 border rounded w-full" required />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="mb-2 px-3 py-2 border rounded w-full" required />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Сообщение" className="mb-2 px-3 py-2 border rounded w-full" required />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={sending}>{sending ? 'Отправка...' : 'Отправить'}</button>
      </form>
    </div>
  );
};

export default CompanyContactForm;
