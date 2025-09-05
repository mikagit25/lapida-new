import React, { useEffect, useState } from 'react';
import SupportGroupDetails from './SupportGroupDetails';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

const SupportGroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/support-groups`)
      .then(res => res.json())
      .then(data => {
        setGroups(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Ошибка загрузки групп');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Загрузка групп поддержки...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  if (selectedGroupId) {
    return <SupportGroupDetails groupId={selectedGroupId} onBack={() => setSelectedGroupId(null)} />;
  }

  return (
    <div className="space-y-4">
      {groups.map(group => (
        <div key={group.id} className="border rounded p-4 bg-white shadow cursor-pointer" onClick={() => setSelectedGroupId(group.id)}>
          <h2 className="text-lg font-semibold mb-2">{group.name}</h2>
          <p className="text-gray-700 mb-2">{group.description}</p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Вступить</button>
        </div>
      ))}
    </div>
  );
};

export default SupportGroupList;
