import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SECTIONS = [
  { key: 'bio', label: 'Биография' },
  { key: 'gallery', label: 'Галерея' },
  { key: 'epitaph', label: 'Эпитафия' },
  { key: 'timeline', label: 'Хронология' },
  { key: 'documents', label: 'Документы' },
  { key: 'comments', label: 'Комментарии' },
  { key: 'other', label: 'Другое' }
];

const ROLES = [
  { key: 'relative', label: 'Родственник' },
  { key: 'friend', label: 'Друг' },
  { key: 'custom', label: 'Пользователь' }
];

export default function MemorialEditorsManager({ memorialId }) {
  const [editors, setEditors] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedRole, setSelectedRole] = useState('custom');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEditors();
    fetchUsers();
  }, [memorialId]);

  async function fetchEditors() {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/memorial-editors/${memorialId}/editors`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setEditors(res.data.editors || []);
    } catch (err) {
      setError('Ошибка загрузки редакторов');
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data.users || []);
    } catch (err) {
      setUsers([]);
    }
  }

  async function addEditor() {
    if (!selectedUser || selectedSections.length === 0) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/memorial-editors/${memorialId}/editors`, {
        userId: selectedUser,
        sections: selectedSections,
        role: selectedRole
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setSelectedUser('');
      setSelectedSections([]);
      setSelectedRole('custom');
      fetchEditors();
    } catch (err) {
      setError('Ошибка добавления редактора');
    } finally {
      setLoading(false);
    }
  }

  async function removeEditor(editorUserId) {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/memorial-editors/${memorialId}/editors/${editorUserId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      fetchEditors();
    } catch (err) {
      setError('Ошибка удаления редактора');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4">Делегирование прав редактирования</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="mb-4">
        <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)} className="border rounded px-2 py-1 mr-2">
          <option value="">Выберите пользователя</option>
          {users.map(u => (
            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
          ))}
        </select>
        <span className="mr-2">Секции:</span>
        {SECTIONS.map(s => (
          <label key={s.key} className="mr-2">
            <input
              type="checkbox"
              checked={selectedSections.includes(s.key)}
              onChange={e => {
                if (e.target.checked) setSelectedSections([...selectedSections, s.key]);
                else setSelectedSections(selectedSections.filter(sec => sec !== s.key));
              }}
            /> {s.label}
          </label>
        ))}
        <span className="ml-2 mr-2">Роль:</span>
        <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="border rounded px-2 py-1">
          {ROLES.map(r => (
            <option key={r.key} value={r.key}>{r.label}</option>
          ))}
        </select>
        <button onClick={addEditor} className="ml-4 px-4 py-2 bg-blue-600 text-white rounded" disabled={loading || !selectedUser || selectedSections.length === 0}>
          Добавить редактора
        </button>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Текущие редакторы:</h3>
        {editors.length === 0 && <div className="text-gray-500">Нет делегированных редакторов</div>}
        <ul>
          {editors.map(e => (
            <li key={e.user._id || e.user} className="mb-2 flex items-center justify-between">
              <span>
                <b>{e.user.name || e.user.email || e.user._id}</b> — {ROLES.find(r => r.key === e.role)?.label || e.role} — секции: {e.sections.join(', ')}
              </span>
              <button onClick={() => removeEditor(e.user._id || e.user)} className="ml-4 px-2 py-1 bg-red-500 text-white rounded" disabled={loading}>Удалить</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
