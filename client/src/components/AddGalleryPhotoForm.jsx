import React, { useState } from 'react';

function AddGalleryPhotoForm({ companyId, onAdd }) {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    let res, data;
    try {
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const token = localStorage.getItem('authToken');
        res = await fetch(`/api/companies/${companyId}/gallery`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
          credentials: 'include',
        });
      } else if (url) {
        res = await fetch(`/api/companies/${companyId}/gallery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('authToken')
              ? { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
              : {}),
          },
          body: JSON.stringify({ url }),
          credentials: 'include',
        });
      } else {
        setError('Выберите файл или введите URL');
        setLoading(false);
        return;
      }
      data = await res.json();
      if (data.gallery) {
        setSuccess(true);
        setUrl('');
        setFile(null);
        if (onAdd) onAdd();
      } else {
        setError(data.message || 'Ошибка загрузки');
      }
    } catch (e) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4 flex flex-col gap-2">
      <label className="font-medium">Загрузить фото (файл):</label>
      <input type="file" accept="image/*" onChange={handleFileChange} className="border px-3 py-2 rounded" />
      <span className="text-xs text-gray-500">или</span>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Ссылка на фото (URL)" className="border px-3 py-2 rounded" />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Фото добавлено!</div>}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
        {loading ? 'Загрузка...' : 'Добавить фото'}
      </button>
    </form>
  );
}

export default AddGalleryPhotoForm;
