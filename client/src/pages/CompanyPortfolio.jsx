import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const CompanyPortfolio = () => {
  const { companySlug } = useParams();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', image: null });
  const [uploadError, setUploadError] = useState('');

  const fetchPortfolio = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/companies/by-slug/${companySlug}`);
      const data = await res.json();
      if (res.ok && data.company) {
        setPortfolio(data.company.portfolio || []);
        setIsOwner(user && data.company.owner && user._id === data.company.owner.toString());
      } else {
        setError(data.message || 'Ошибка загрузки портфолио');
      }
    } catch (e) {
      console.error('Ошибка загрузки портфолио:', e);
      setError('Ошибка загрузки портфолио');
    }
    setLoading(false);
  }, [companySlug, user]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const handleInputChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleAddWork = async e => {
    e.preventDefault();
    setUploadError('');
    if (!form.title || !form.image) {
      setUploadError('Заполните все обязательные поля');
      return;
    }
    setAdding(true);
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('date', form.date);
      formData.append('image', form.image);
      const res = await fetch(`${API_BASE_URL}/companies/by-slug/${companySlug}`);
      const data = await res.json();
      if (!res.ok || !data.company || !data.company._id) throw new Error('Компания не найдена');
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const uploadRes = await fetch(`${API_BASE_URL}/companies/${data.company._id}/portfolio`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.message || 'Ошибка загрузки');
      setPortfolio(uploadData.portfolio || []);
      setForm({ title: '', description: '', date: '', image: null });
    } catch (e) {
      setUploadError(e.message || 'Ошибка загрузки');
    }
    setAdding(false);
  };

  if (loading) return <div className="text-gray-500">Загрузка портфолио...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const handleDeleteWork = async idx => {
    if (!window.confirm('Удалить эту работу?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/companies/by-slug/${companySlug}`);
      const data = await res.json();
      if (!res.ok || !data.company || !data.company._id) throw new Error('Компания не найдена');
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const delRes = await fetch(`${API_BASE_URL}/companies/${data.company._id}/portfolio/${idx}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const delData = await delRes.json();
      if (!delRes.ok) throw new Error(delData.message || 'Ошибка удаления');
      setPortfolio(delData.portfolio || []);
    } catch (e) {
      alert(e.message || 'Ошибка удаления');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Портфолио компании</h1>

      {isOwner && (
        <form className="mb-8 bg-gray-50 p-4 rounded shadow" onSubmit={handleAddWork}>
          <div className="mb-2 font-semibold">Добавить работу</div>
          <input type="text" name="title" value={form.title} onChange={handleInputChange} placeholder="Заголовок" className="mb-2 px-3 py-2 border rounded w-full" required />
          <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Описание" className="mb-2 px-3 py-2 border rounded w-full" />
          <input type="text" name="date" value={form.date} onChange={handleInputChange} placeholder="Дата (необязательно)" className="mb-2 px-3 py-2 border rounded w-full" />
          <input type="file" name="image" accept="image/*" onChange={handleInputChange} className="mb-2" required />
          {uploadError && <div className="text-red-600 mb-2">{uploadError}</div>}
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={adding}>{adding ? 'Загрузка...' : 'Добавить'}</button>
        </form>
      )}

      {!portfolio.length && <div className="text-gray-500">Портфолио пока не добавлено.</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {portfolio.map((work, idx) => (
          <div key={idx} className="bg-white rounded shadow p-4 flex flex-col items-center">
            {work.image && (
              <img src={work.image} alt={work.title || 'Работа'} className="w-full h-48 object-cover rounded mb-2" />
            )}
            <div className="font-semibold mb-1 text-center">{work.title}</div>
            {work.description && <div className="text-gray-600 text-sm mb-2 text-center">{work.description}</div>}
            {work.date && <div className="text-xs text-gray-400">{work.date}</div>}
            {isOwner && (
              <button onClick={() => handleDeleteWork(idx)} className="mt-2 text-xs text-red-600 hover:underline">Удалить</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyPortfolio;
