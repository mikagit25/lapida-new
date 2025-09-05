import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

const MediaList = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/media`)
      .then(res => res.json())
      .then(data => {
        setMedia(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка загрузки файлов');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка файлов...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-4">
      {media.map(file => (
        <div key={file.id} className="border rounded p-4 bg-white shadow">
          <div className="font-semibold mb-1">{file.name}</div>
          <div className="text-gray-700 mb-1">{file.type}</div>
          <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">Открыть / Скачать</a>
        </div>
      ))}
    </div>
  );
};

export default MediaList;
