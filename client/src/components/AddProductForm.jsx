import React, { useState } from 'react';

function AddProductForm({ companyId, onAdd }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFileChange = e => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('authToken');
      let res, data;
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file, idx) => formData.append('images', file));
        Object.entries(form).forEach(([key, value]) => formData.append(key, value));
        res = await fetch(`/api/companies/${companyId}/products`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData,
          credentials: 'include'
        });
      } else {
        res = await fetch(`/api/companies/${companyId}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(form),
          credentials: 'include'
        });
      }
      data = await res.json();
      if (data.products) {
        setSuccess(true);
        setForm({ name: '', description: '', price: '', category: '' });
        setFiles([]);
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
      <input name="name" value={form.name} onChange={handleChange} placeholder="Название" required className="border px-3 py-2 rounded" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Цена" type="number" required className="border px-3 py-2 rounded" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Категория" className="border px-3 py-2 rounded" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" className="border px-3 py-2 rounded" />
      <label className="font-medium">Фото товара (можно выбрать несколько):</label>
      <input type="file" accept="image/*" multiple onChange={handleFileChange} className="border px-3 py-2 rounded" />
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
        {loading ? 'Загрузка...' : 'Добавить товар'}
      </button>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Товар добавлен!</div>}
    </form>
  );
}

export default AddProductForm;
