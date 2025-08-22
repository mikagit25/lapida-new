import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// TODO: заменить на реальный API для мемориалов
const mockMemorials = [
  { _id: 'm1', title: 'Иванов Иван Иванович', createdBy: 'user1', isPublic: true, isHidden: false },
  { _id: 'm2', title: 'Петров Петр Петрович', createdBy: 'user2', isPublic: false, isHidden: false },
];

const AdminMemorialsManager = () => {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMemorials() {
      try {
        setLoading(true);
        setError('');
        const { newMemorialService } = await import('../services/api');
        const response = await newMemorialService.getAll();
        setMemorials(response);
      } catch (err) {
        setError('Ошибка загрузки мемориалов');
      } finally {
        setLoading(false);
      }
    }
    fetchMemorials();
  }, []);

  const handleHide = (id) => {
    setMemorials(ms => ms.map(m => m._id === id ? { ...m, isHidden: !m.isHidden } : m));
    // TODO: PATCH /api/memorials/:id/hide
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить мемориал?')) {
      const deleteMemorial = async () => {
        try {
          const { newMemorialService } = await import('../services/api');
          await newMemorialService.remove(id);
          setMemorials(ms => ms.filter(m => m._id !== id));
        } catch (err) {
          alert('Ошибка удаления мемориала');
        }
      };
      deleteMemorial();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Мемориалы
        {memorials.length === 1 && memorials[0].title ? `: ${memorials[0].title}` : ''}
      </h2>
      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Имя мемориала</th>
              <th className="border px-2 py-1">Заголовок</th>
              <th className="border px-2 py-1">Автор</th>
              <th className="border px-2 py-1">Публичный</th>
              <th className="border px-2 py-1">Статус</th>
              <th className="border px-2 py-1">Действия</th>
            </tr>
          </thead>
          <tbody>
            {memorials.map(m => (
              <tr key={m._id}>
                <td className="border px-2 py-1">{`${m.firstName || ''} ${m.lastName || ''}`.trim() || '-'}</td>
                <td className="border px-2 py-1">{m.title}</td>
                <td className="border px-2 py-1">
                  {typeof m.createdBy === 'object' && m.createdBy !== null
                    ? (m.createdBy.name || m.createdBy.email || m.createdBy._id)
                    : m.createdBy}
                </td>
                <td className="border px-2 py-1">{m.isPublic ? 'Да' : 'Нет'}</td>
                <td className="border px-2 py-1">{m.isHidden ? 'Скрыт' : 'Активен'}</td>
                <td className="border px-2 py-1">
                  <button className="text-yellow-600 hover:underline mr-2" onClick={() => handleHide(m._id)}>
                    {m.isHidden ? 'Показать' : 'Скрыть'}
                  </button>
                  <Link
                    className="text-blue-600 hover:underline mr-2"
                    to={
                      m.customSlug
                        ? `/memorial/${m.customSlug}`
                        : m.shareUrl
                          ? `/memorial/${m.shareUrl}`
                          : `/memorial/${m._id}`
                    }
                  >Открыть</Link>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(m._id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMemorialsManager;
