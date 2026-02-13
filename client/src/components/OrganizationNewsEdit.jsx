import React, { useState } from 'react';

const emptyNews = { title: '', date: '', text: '' };

const OrganizationNewsEdit = ({ news = [], onSave }) => {
  const [list, setList] = useState(news);
  const [newItem, setNewItem] = useState(emptyNews);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addNews = () => {
    if (newItem.title.trim()) {
      setList([...list, newItem]);
      setNewItem(emptyNews);
    }
  };

  const removeNews = idx => {
    setList(list.filter((_, i) => i !== idx));
  };

  const handleChange = e => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await onSave(list);
      setSuccess(true);
    } catch (err) {
      console.error('Ошибка сохранения новостей', err);
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">Новости</h2>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input name="title" value={newItem.title} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Заголовок" />
        <input name="date" value={newItem.date} onChange={handleChange} type="date" className="border rounded px-3 py-2" />
        <input name="text" value={newItem.text} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Текст новости" />
        <button type="button" onClick={addNews} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Добавить</button>
      </div>
      <ul className="divide-y divide-gray-200 mb-4">
        {list.map((n, i) => (
          <li key={i} className="py-2 flex items-center gap-2">
            <div className="flex-1">
              <div className="font-semibold">{n.title} {n.date && (<span className="text-gray-500 text-sm">({n.date})</span>)}</div>
              <div className="text-gray-600 text-sm">{n.text}</div>
            </div>
            <button type="button" onClick={() => removeNews(i)} className="bg-red-600 text-white rounded px-2 py-1 text-xs">✕</button>
          </li>
        ))}
      </ul>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Сохранено!</div>}
      <button type="button" onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold">
        {saving ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
    </div>
  );
};

export default OrganizationNewsEdit;
