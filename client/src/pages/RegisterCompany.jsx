import React, { useState } from 'react';
import { findWorkingApiUrl } from '../config/api-universal';
import { useNavigate } from 'react-router-dom';

const RegisterCompany = () => {
  const [form, setForm] = useState({
    name: '',
    inn: '',
    address: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const apiUrl = await findWorkingApiUrl();
      const token = localStorage.getItem('authToken');
      const res = await fetch(`${apiUrl}/companies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.company) {
        setSuccess(true);
        setTimeout(() => navigate(`/company-cabinet/${data.company._id}`), 1500);
      } else {
        setError(data.error || 'Ошибка регистрации');
      }
    } catch (e) {
      setError('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Регистрация компании</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block mb-1 font-medium">Название компании</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required className="border px-3 py-2 rounded-md w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">ИНН</label>
            <input type="text" name="inn" value={form.inn} onChange={handleChange} required className="border px-3 py-2 rounded-md w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Адрес</label>
            <input type="text" name="address" value={form.address} onChange={handleChange} required className="border px-3 py-2 rounded-md w-full" />
          </div>
          <div>
            <label className="block mb-1 font-medium">Описание</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="border px-3 py-2 rounded-md w-full" rows={3} />
          </div>
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">Компания успешно зарегистрирована!</div>}
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold w-full">
            {loading ? 'Регистрация...' : 'Зарегистрировать'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterCompany;
