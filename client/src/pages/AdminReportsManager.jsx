import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// TODO: заменить на реальный API для жалоб
const mockReports = [
  { _id: 'r1', type: 'Мемориал', targetId: 'm1', reason: 'Неприемлемый контент', status: 'open' },
  { _id: 'r2', type: 'Пользователь', targetId: 'u2', reason: 'Спам', status: 'closed' },
];

const AdminReportsManager = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true);
        setError('');
        const { reportService } = await import('../services/api');
        const response = await reportService.getAll();
        setReports(response);
      } catch (err) {
        setError('Ошибка загрузки жалоб');
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, []);

  const handleClose = (id) => {
    setReports(rs => rs.map(r => r._id === id ? { ...r, status: 'closed' } : r));
    // TODO: PATCH /api/reports/:id/close
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить жалобу?')) {
      setReports(rs => rs.filter(r => r._id !== id));
      // TODO: DELETE /api/reports/:id
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Жалобы/репорты</h2>
      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Тип</th>
              <th className="border px-2 py-1">ID объекта</th>
              <th className="border px-2 py-1">Причина</th>
              <th className="border px-2 py-1">Статус</th>
              <th className="border px-2 py-1">Действия</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r._id}>
                <td className="border px-2 py-1">{r.type}</td>
                <td className="border px-2 py-1">{r.targetId}</td>
                <td className="border px-2 py-1">{r.reason}</td>
                <td className="border px-2 py-1">{r.status === 'closed' ? 'Закрыта' : 'Открыта'}</td>
                <td className="border px-2 py-1">
                  {r.status !== 'closed' && (
                    <button className="text-yellow-600 hover:underline mr-2" onClick={() => handleClose(r._id)}>
                      Закрыть
                    </button>
                  )}
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(r._id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReportsManager;
