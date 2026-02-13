import React, { useEffect, useRef, useState } from 'react';
import { API_BASE_URL } from '../config/api';

const CompanyAnalytics = ({ companyId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const lastFetchedId = useRef(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/companies/${companyId}/analytics`, {
          credentials: 'include',
        });
        const contentType = res.headers.get('content-type') || '';
        const payload = contentType.includes('application/json')
          ? await res.json()
          : { message: await res.text() };

        if (res.ok && payload.stats) {
          setStats(payload.stats);
        } else {
          // Показываем текст ошибки даже если пришёл plain text (например, 429)
          setError(payload.message || 'Ошибка загрузки статистики');
        }
      } catch (err) {
        console.error('Ошибка загрузки статистики', err);
        setError('Ошибка загрузки статистики');
      }
      setLoading(false);
    }
    if (companyId) {
      // Защита от двойного вызова эффекта в React StrictMode
      if (lastFetchedId.current === companyId) return;
      lastFetchedId.current = companyId;
      fetchStats();
    }
  }, [companyId]);

  if (loading) return <div className="text-gray-500">Загрузка аналитики...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!stats) return null;

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Аналитика компании</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="font-semibold text-gray-700 mb-1">Просмотры</div>
          <div className="text-3xl font-bold text-purple-700">{stats.views ?? 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="font-semibold text-gray-700 mb-1">Заказы</div>
          <div className="text-3xl font-bold text-blue-700">{stats.orders ?? 0}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="font-semibold text-gray-700 mb-1">Отзывы</div>
          <div className="text-3xl font-bold text-green-700">{stats.reviews ?? 0}</div>
        </div>
      </div>
      {/* Можно добавить графики динамики, если stats содержит массивы */}
      {stats.viewsByDay && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Динамика просмотров</h3>
          <div className="overflow-x-auto">
            <table className="min-w-max w-full text-sm">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Дата</th>
                  <th className="px-2 py-1 text-left">Просмотры</th>
                </tr>
              </thead>
              <tbody>
                {stats.viewsByDay.map((row, i) => (
                  <tr key={i}>
                    <td className="px-2 py-1">{row.date}</td>
                    <td className="px-2 py-1">{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyAnalytics;
