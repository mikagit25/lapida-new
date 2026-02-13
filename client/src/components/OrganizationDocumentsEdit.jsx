import React, { useState } from 'react';

const OrganizationDocumentsEdit = ({ documents = [], onSave }) => {
  const [list, setList] = useState(documents);
  const [newDoc, setNewDoc] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addDoc = () => {
    if (newDoc.trim()) {
      setList([...list, newDoc.trim()]);
      setNewDoc('');
    }
  };

  const removeDoc = idx => {
    setList(list.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await onSave(list);
      setSuccess(true);
    } catch (err) {
      console.error('Ошибка сохранения документов', err);
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">Документы</h2>
      <div className="flex gap-2 mb-4">
        <input value={newDoc} onChange={e => setNewDoc(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="URL документа" />
        <button type="button" onClick={addDoc} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Добавить</button>
      </div>
      <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
        {list.map((doc, i) => (
          <li key={i} className="flex items-center gap-2">
            <a href={doc} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Документ {i + 1}</a>
            <button type="button" onClick={() => removeDoc(i)} className="bg-red-600 text-white rounded px-2 py-1 text-xs">✕</button>
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

export default OrganizationDocumentsEdit;
