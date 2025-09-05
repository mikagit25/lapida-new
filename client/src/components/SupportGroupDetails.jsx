import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

const SupportGroupDetails = ({ groupId, onBack }) => {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [adding, setAdding] = useState(false);
  const [joining, setJoining] = useState(false);
  const [userName, setUserName] = useState('');

  const fetchGroup = () => {
    apiFetch(`${API_BASE_URL}/support-groups/${groupId}`)
      .then(res => res.json())
      .then(data => {
        setGroup(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Ошибка загрузки группы');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGroup();
    // eslint-disable-next-line
  }, [groupId]);

  const handleAddDiscussion = async (e) => {
    e.preventDefault();
    if (!newDiscussion.trim()) return;
    setAdding(true);
    try {
      await apiFetch(`${API_BASE_URL}/support-groups/${groupId}/discussions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newDiscussion })
      });
      setNewDiscussion('');
      fetchGroup();
    } catch (err) {
      alert('Ошибка добавления обсуждения');
    } finally {
      setAdding(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setJoining(true);
    try {
      await apiFetch(`${API_BASE_URL}/support-groups/${groupId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: userName })
      });
      setUserName('');
      fetchGroup();
    } catch (err) {
      alert('Ошибка вступления в группу');
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <div>Загрузка данных группы...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="border rounded p-4 bg-white shadow mt-6">
      <button className="mb-4 px-3 py-1 bg-gray-200 rounded" onClick={onBack}>← Назад к списку</button>
      <h2 className="text-xl font-bold mb-2">{group.name}</h2>
      <p className="mb-2">{group.description}</p>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Участники группы</h3>
        {group.members && group.members.length > 0 ? (
          <ul className="list-disc pl-5 mb-2">
            {group.members.map((m, idx) => (
              <li key={idx}>{m}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mb-2">Пока нет участников.</p>
        )}
        <form onSubmit={handleJoin} className="flex gap-2 mb-2">
          <input
            type="text"
            value={userName}
            onChange={e => setUserName(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            placeholder="Ваше имя для вступления"
            disabled={joining}
          />
          <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded" disabled={joining}>
            {joining ? 'Вступление...' : 'Вступить'}
          </button>
        </form>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Обсуждения</h3>
        {group.discussions && group.discussions.length > 0 ? (
          <ul className="list-disc pl-5 mb-4">
            {group.discussions.map((d, idx) => (
              <li key={idx}>{d}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 mb-4">Пока нет обсуждений.</p>
        )}
        <form onSubmit={handleAddDiscussion} className="flex gap-2">
          <input
            type="text"
            value={newDiscussion}
            onChange={e => setNewDiscussion(e.target.value)}
            className="border rounded px-2 py-1 flex-1"
            placeholder="Добавить обсуждение..."
            disabled={adding}
          />
          <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded" disabled={adding}>
            {adding ? 'Добавление...' : 'Добавить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SupportGroupDetails;
