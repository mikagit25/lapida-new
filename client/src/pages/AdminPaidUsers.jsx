import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPaidUsers = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [paid, setPaid] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSetPaid = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Получить пользователя по email
      const resUser = await fetch(`/api/users/by-email/${encodeURIComponent(email)}`);
      const dataUser = await resUser.json();
      if (!dataUser.user || !dataUser.user._id) throw new Error('Пользователь не найден');
      // Установить paid
      const res = await fetch('/api/admin-paid/set-paid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId: dataUser.user._id, paid })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Ошибка');
      setResult({ success: true, message: 'Статус обновлён', user: data.user });
    } catch (e) {
      setResult({ success: false, message: e.message });
    }
    setLoading(false);
  };

  if (!user || user.role !== 'admin') {
    return <div className="max-w-xl mx-auto py-10 px-4 text-red-600">Нет доступа</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Управление платным статусом пользователей</h1>
      <div className="mb-4">
        <input
          type="email"
          className="border px-3 py-2 rounded w-full mb-2"
          placeholder="Email пользователя"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label className="inline-flex items-center mr-4">
          <input type="radio" checked={paid} onChange={() => setPaid(true)} />
          <span className="ml-2">Сделать платным</span>
        </label>
        <label className="inline-flex items-center">
          <input type="radio" checked={!paid} onChange={() => setPaid(false)} />
          <span className="ml-2">Сделать бесплатным</span>
        </label>
      </div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
        onClick={handleSetPaid}
        disabled={loading || !email}
      >
        {loading ? 'Обновление...' : 'Обновить статус'}
      </button>
      {result && (
        <div className={`mt-4 p-2 rounded ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default AdminPaidUsers;
