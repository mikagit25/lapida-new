import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';

export default function CompanyLogoUploader({ company, isOwner, setCompany }) {
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  if (!isOwner) return null;

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    const file = e.target.logo.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('logo', file);
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    try {
      setUploading(true);
      const res = await fetch(`${API_BASE_URL}/companies/${company._id}/logo`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Ошибка загрузки');
      }
      const data = await res.json();
      if (data.logo) {
        setCompany(prev => ({ ...prev, logo: data.logo }));
      } else {
        setError('Логотип не сохранён (пустой ответ)');
      }
    } catch (err) {
      setError(err.message || 'Ошибка загрузки логотипа');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col items-center">
      <input type="file" name="logo" accept="image/*" className="mb-2" />
      <button type="submit" className="text-xs bg-blue-500 text-white px-2 py-1 rounded disabled:opacity-50" disabled={uploading}>
        {uploading ? 'Загрузка...' : 'Обновить аватар'}
      </button>
      {error && <div className="text-xs text-red-600 mt-1 text-center max-w-xs">{error}</div>}
    </form>
  );
}
