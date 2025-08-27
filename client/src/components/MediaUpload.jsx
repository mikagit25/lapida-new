import React, { useState } from 'react';

const MediaUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      await fetch('/api/media', {
        method: 'POST',
        body: formData
      });
      setFile(null);
    } catch {
      setError('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload} className="mb-6 flex gap-2 flex-wrap items-center">
      <input type="file" onChange={handleChange} accept="video/*,audio/*,.pdf,.doc,.docx,.txt" />
      <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded" disabled={uploading}>
        {uploading ? 'Загрузка...' : 'Загрузить'}
      </button>
      {error && <span className="text-red-600 ml-2">{error}</span>}
    </form>
  );
};

export default MediaUpload;
