
import React, { useState, useEffect } from 'react';
import UserSearch from '../components/UserSearch';
import UsersCatalogBlock from '../components/UsersCatalogBlock';
import { userService } from '../services/api';

const UsersCatalogPage = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    userService.getAllUsers()
      .then(res => setUsers(res.users || []))
      .catch(() => setError('Ошибка загрузки пользователей'))
      .finally(() => setLoading(false));
  }, []);

  // Фильтрация пользователей по поисковому запросу
  const filteredUsers = searchQuery.length >= 2
    ? users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : users;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Каталог пользователей</h1>
      <UserSearch
        placeholder="Поиск пользователей..."
        onUserSelect={user => setSearchQuery(user.name || user.email || '')}
        className="mb-4"
      />
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Введите имя или email для поиска"
        className="border px-3 py-2 rounded w-full mb-4"
      />
  <UsersCatalogBlock users={filteredUsers} loading={loading} error={error} />
    </div>
  );
};

export default UsersCatalogPage;
