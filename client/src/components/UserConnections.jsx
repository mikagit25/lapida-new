import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserConnections() {
  const [friends, setFriends] = useState([]);
  const [relatives, setRelatives] = useState([]);
  const [tab, setTab] = useState('friends');
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConnections();
  }, [tab]);

  async function fetchConnections() {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      if (tab === 'friends') {
        const res = await axios.get('/api/user-connections/friends', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        setFriends(res.data.friends || []);
      } else {
        const res = await axios.get('/api/user-connections/relatives', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        setRelatives(res.data.relatives || []);
      }
    } catch (err) {
      setError('Ошибка загрузки связей');
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data.users || []);
    } catch (err) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  async function addConnection(type, userId) {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      await axios.post(`/api/user-connections/${type}/${userId}`, {}, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      fetchConnections();
    } catch (err) {
      setError('Ошибка добавления');
    } finally {
      setLoading(false);
    }
  }

  async function removeConnection(type, userId) {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`/api/user-connections/${type}/${userId}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      fetchConnections();
    } catch (err) {
      setError('Ошибка удаления');
    } finally {
      setLoading(false);
    }
  }

  function renderList(list, type) {
    return (
      <ul className="mb-4">
        {list.length === 0 && <li className="text-gray-500">Нет пользователей</li>}
        {list.map(u => (
          <li key={u._id} className="flex items-center justify-between mb-2">
            <span>
              <img src={u.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-2 inline-block" />
              <b>{u.name || u.email}</b>
            </span>
            <button onClick={() => removeConnection(type, u._id)} className="ml-4 px-2 py-1 bg-red-500 text-white rounded" disabled={loading}>Удалить</button>
          </li>
        ))}
      </ul>
    );
  }

  function renderSearch() {
    return (
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск пользователя..."
          className="border rounded px-2 py-1 mr-2"
        />
        <button onClick={fetchUsers} className="px-2 py-1 bg-blue-600 text-white rounded" disabled={loading}>Найти</button>
        <ul className="mt-2">
          {users.filter(u => (u.name || u.email).toLowerCase().includes(search.toLowerCase())).map(u => (
            <li key={u._id} className="flex items-center justify-between mb-2">
              <span>
                <img src={u.avatar} alt="avatar" className="w-8 h-8 rounded-full mr-2 inline-block" />
                <b>{u.name || u.email}</b>
              </span>
              <button onClick={() => addConnection(tab, u._id)} className="ml-4 px-2 py-1 bg-green-500 text-white rounded" disabled={loading}>Добавить</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Связи пользователя</h2>
      <div className="mb-4">
        <button onClick={() => setTab('friends')} className={`px-4 py-2 rounded mr-2 ${tab === 'friends' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Друзья</button>
        <button onClick={() => setTab('relatives')} className={`px-4 py-2 rounded ${tab === 'relatives' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>Родственники</button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {tab === 'friends' ? renderList(friends, 'friends') : renderList(relatives, 'relatives')}
      {renderSearch()}
    </div>

  );
}

export default UserConnections;
