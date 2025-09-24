import React, { useState } from 'react';

const OrganizationGalleryEdit = ({ photos = [], onSave }) => {
  const [gallery, setGallery] = useState(photos);
  const [newPhoto, setNewPhoto] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addPhoto = () => {
    if (newPhoto.trim()) {
      setGallery([...gallery, newPhoto.trim()]);
      setNewPhoto('');
    }
  };

  const removePhoto = idx => {
    setGallery(gallery.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await onSave(gallery);
      setSuccess(true);
    } catch (err) {
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">Галерея</h2>
      <div className="flex gap-2 mb-4">
        <input value={newPhoto} onChange={e => setNewPhoto(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="URL фото" />
        <button type="button" onClick={addPhoto} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Добавить</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {gallery.map((url, i) => (
          <div key={i} className="relative group">
            <img src={url} alt="Фото" className="w-full h-24 object-cover rounded shadow" />
            <button type="button" onClick={() => removePhoto(i)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs opacity-80 group-hover:opacity-100">✕</button>
          </div>
        ))}
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Сохранено!</div>}
      <button type="button" onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold">
        {saving ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
    </div>
  );
};

export default OrganizationGalleryEdit;
