import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';
import { Link } from 'react-router-dom';

const AdminCabinet = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      userService.getAllUsers()
        .then(res => setUsers(res.users || []))
        .catch(() => setError('Ошибка загрузки пользователей'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-red-600">Нет доступа. Только для администратора.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Админ-кабинет сайта</h1>
        <div className="mb-8 flex gap-4">
          <Link to="/admin/users" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Пользователи</Link>
          <Link to="/admin/pages" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Страницы</Link>
          <Link to="/admin/companies" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Компании</Link>
          <Link to="/admin/memorials" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Мемориалы</Link>
          <Link to="/admin/reports" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Жалобы</Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Пользователи сайта</h2>
          {loading ? (
            <div>Загрузка...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <table className="w-full text-left border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Имя</th>
                  <th className="border px-2 py-1">Email</th>
                  <th className="border px-2 py-1">Роль</th>
                  <th className="border px-2 py-1">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td className="border px-2 py-1">{u.name}</td>
                    <td className="border px-2 py-1">{u.email}</td>
                    <td className="border px-2 py-1">{u.role}</td>
                    <td className="border px-2 py-1">
                      <button className="text-blue-600 hover:underline mr-2">Редактировать</button>
                      <button className="text-red-600 hover:underline">Удалить</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCabinet;
