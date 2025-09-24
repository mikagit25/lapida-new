import React, { useState } from 'react';

const emptyContact = { type: '', value: '' };

const OrganizationContactsEdit = ({ contacts = [], onSave }) => {
  const [list, setList] = useState(contacts);
  const [newContact, setNewContact] = useState(emptyContact);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addContact = () => {
    if (newContact.type.trim() && newContact.value.trim()) {
      setList([...list, newContact]);
      setNewContact(emptyContact);
    }
  };

  const removeContact = idx => {
    setList(list.filter((_, i) => i !== idx));
  };

  const handleChange = e => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
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
      <h2 className="text-xl font-semibold mb-2 text-blue-800">Контакты</h2>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input name="type" value={newContact.type} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Тип (телефон, email, сайт)" />
        <input name="value" value={newContact.value} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Значение" />
        <button type="button" onClick={addContact} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Добавить</button>
      </div>
      <ul className="divide-y divide-gray-200 mb-4">
        {list.map((c, i) => (
          <li key={i} className="py-2 flex items-center gap-2">
            <div className="flex-1">
              <div className="font-semibold">{c.type}</div>
              <div className="text-gray-600 text-sm">{c.value}</div>
            </div>
            <button type="button" onClick={() => removeContact(i)} className="bg-red-600 text-white rounded px-2 py-1 text-xs">✕</button>
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

export default OrganizationContactsEdit;
