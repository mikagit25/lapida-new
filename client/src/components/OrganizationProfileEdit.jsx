import React, { useState } from 'react';

const OrganizationProfileEdit = ({ org, onSave }) => {
  const [form, setForm] = useState({
    name: org.name || '',
    type: org.type || '',
    confession: org.confession || '',
    description: org.description || '',
    logo: org.logo || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      // onSave должен быть асинхронным и обновлять данные на сервере
      await onSave(form);
      setSuccess(true);
    } catch (err) {
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">Профиль организации</h2>
      <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Название организации" />
      <input name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Тип (церковь, приход...)" />
      <input name="confession" value={form.confession} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Конфессия" />
      <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Описание" />
      <input name="logo" value={form.logo} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="URL логотипа" />
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">Сохранено!</div>}
      <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold">
        {saving ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  );
};

export default OrganizationProfileEdit;
