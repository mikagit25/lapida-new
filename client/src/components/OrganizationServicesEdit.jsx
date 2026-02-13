import React, { useState } from 'react';

const emptyService = { name: '', description: '', price: '', available: true };

const OrganizationServicesEdit = ({ services = [], onSave }) => {
  const [list, setList] = useState(services);
  const [newService, setNewService] = useState(emptyService);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addService = () => {
    if (newService.name.trim()) {
      setList([...list, newService]);
      setNewService(emptyService);
    }
  };

  const removeService = idx => {
    setList(list.filter((_, i) => i !== idx));
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setNewService({ ...newService, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await onSave(list);
      setSuccess(true);
    } catch (err) {
      console.error('Ошибка сохранения услуг', err);
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">Услуги</h2>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input name="name" value={newService.name} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Название услуги" />
        <input name="description" value={newService.description} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Описание" />
        <input name="price" value={newService.price} onChange={handleChange} type="number" className="w-28 border rounded px-3 py-2" placeholder="Цена" />
        <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="available" checked={newService.available} onChange={handleChange} />Доступна</label>
        <button type="button" onClick={addService} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Добавить</button>
      </div>
      <ul className="divide-y divide-gray-200 mb-4">
        {list.map((s, i) => (
          <li key={i} className="py-2 flex items-center gap-2">
            <div className="flex-1">
              <div className="font-semibold">{s.name}</div>
              <div className="text-gray-600 text-sm">{s.description}</div>
              {s.price && <div className="text-blue-700 font-bold">Цена: {s.price} ₽</div>}
              <div className={s.available ? 'text-green-600' : 'text-red-600'}>{s.available ? 'Доступна' : 'Недоступна'}</div>
            </div>
            <button type="button" onClick={() => removeService(i)} className="bg-red-600 text-white rounded px-2 py-1 text-xs">✕</button>
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

export default OrganizationServicesEdit;
