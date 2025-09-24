import React, { useState } from 'react';

const emptyMember = { name: '', position: '', contacts: '', photo: '' };

const OrganizationTeamEdit = ({ team = [], onSave }) => {
  const [list, setList] = useState(team);
  const [newMember, setNewMember] = useState(emptyMember);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addMember = () => {
    if (newMember.name.trim()) {
      setList([...list, newMember]);
      setNewMember(emptyMember);
    }
  };

  const removeMember = idx => {
    setList(list.filter((_, i) => i !== idx));
  };

  const handleChange = e => {
    setNewMember({ ...newMember, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await onSave(list);
      setSuccess(true);
    } catch (err) {
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">Команда</h2>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input name="name" value={newMember.name} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Имя" />
        <input name="position" value={newMember.position} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Должность" />
        <input name="contacts" value={newMember.contacts} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Контакты" />
        <input name="photo" value={newMember.photo} onChange={handleChange} className="w-48 border rounded px-3 py-2" placeholder="URL фото" />
        <button type="button" onClick={addMember} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Добавить</button>
      </div>
      <ul className="divide-y divide-gray-200 mb-4">
        {list.map((m, i) => (
          <li key={i} className="py-2 flex items-center gap-2">
            {m.photo && <img src={m.photo} alt="Фото" className="w-12 h-12 object-cover rounded-full" />}
            <div className="flex-1">
              <div className="font-semibold">{m.name}</div>
              <div className="text-gray-600 text-sm">{m.position}</div>
              <div className="text-gray-500 text-xs">{m.contacts}</div>
            </div>
            <button type="button" onClick={() => removeMember(i)} className="bg-red-600 text-white rounded px-2 py-1 text-xs">✕</button>
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

export default OrganizationTeamEdit;
