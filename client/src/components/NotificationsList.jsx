import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const NotificationsList = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    fetch(`/api/notifications/user/${user._id}?page=${page}&limit=${limit}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setNotifications(data.notifications || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
        setError('');
      })
      .catch(() => setError('Ошибка загрузки уведомлений'))
      .finally(() => setLoading(false));
  }, [user, page, limit]);

  if (loading) return <div className="p-4">Загрузка уведомлений...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  const filtered = filter === 'all' ? notifications : notifications.filter(n => n.type === filter);
  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Уведомления</h2>
      <div className="mb-4 flex gap-4 items-center">
        <label className="font-medium">Фильтр по типу:</label>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-2 py-1 border rounded">
          <option value="all">Все</option>
          <option value="order-status">Статус заказа</option>
          {/* Добавьте другие типы при необходимости */}
        </select>
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          onClick={async () => {
            try {
              const res = await fetch(`/api/notifications/user/${user._id}/read-all`, {
                method: 'PATCH',
                credentials: 'include'
              });
              if (res.ok) {
                setNotifications(notifications => notifications.map(n => ({ ...n, read: true })));
              }
            } catch {}
          }}
        >Отметить все как прочитанные</button>
      </div>
      {/* Пагинация */}
      <div className="mb-4 flex gap-2 items-center justify-end">
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >Назад</button>
        <span>Стр. {page} из {pages}</span>
        <button
          className="px-2 py-1 border rounded disabled:opacity-50"
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
        >Вперед</button>
      </div>
      {filtered.length === 0 ? (
        <div className="text-gray-500">Нет уведомлений по выбранному фильтру</div>
      ) : (
        <ul className="space-y-3">
          {filtered.map(n => (
            <li key={n._id} className={"border-b pb-2 " + (n.read ? "text-gray-500" : "text-black") }>
              <div>{n.message}</div>
              <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
              {!n.read && (
                <button
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                  onClick={async () => {
                    try {
                      const res = await fetch(`/api/notifications/${n._id}/read`, {
                        method: 'PATCH',
                        credentials: 'include'
                      });
                      if (res.ok) {
                        setNotifications(notifications => notifications.map(notif => notif._id === n._id ? { ...notif, read: true } : notif));
                      }
                    } catch {}
                  }}
                >Прочитано</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsList;
