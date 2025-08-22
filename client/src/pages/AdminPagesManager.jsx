import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// TODO: заменить на реальный API для страниц
const mockPages = [
  { id: 'home', path: '/', title: 'Главная', isHidden: false },
  { id: 'cabinet', path: '/cabinet', title: 'Личный кабинет', isHidden: false },
  { id: 'profile', path: '/profile', title: 'Профиль', isHidden: false },
  { id: 'company-cabinet', path: '/company-cabinet/:id', title: 'Кабинет компании', isHidden: false },
  { id: 'memorial', path: '/memorial/:id', title: 'Мемориал', isHidden: false },
];

const AdminPagesManager = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPages() {
      try {
        setLoading(true);
        setError('');
        const { pageService } = await import('../services/api');
        const response = await pageService.getAll();
        setPages(Array.isArray(response) ? response : response.pages || []);
      } catch (err) {
        setError('Ошибка загрузки страниц');
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  const handleHide = (id) => {
    setPages(pages => pages.map(p => p.id === id ? { ...p, isHidden: !p.isHidden } : p));
    // TODO: PATCH /api/pages/:id/hide
  };

  const handleDelete = (id) => {
    if (window.confirm('Удалить страницу?')) {
      setPages(pages => pages.filter(p => p.id !== id));
      // TODO: DELETE /api/pages/:id
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">Страницы сайта</h2>
      {loading ? (
        <div>Загрузка...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Путь</th>
              <th className="border px-2 py-1">Заголовок</th>
              <th className="border px-2 py-1">Статус</th>
              <th className="border px-2 py-1">Действия</th>
            </tr>
          </thead>
          <tbody>
            {pages.map(p => (
              <tr key={p.id}>
                <td className="border px-2 py-1">{p.path}</td>
                <td className="border px-2 py-1">{p.title}</td>
                <td className="border px-2 py-1">{p.isHidden ? 'Скрыта' : 'Активна'}</td>
                <td className="border px-2 py-1">
                  <button className="text-yellow-600 hover:underline mr-2" onClick={() => handleHide(p.id)}>
                    {p.isHidden ? 'Показать' : 'Скрыть'}
                  </button>
                  <Link className="text-blue-600 hover:underline mr-2" to={p.path}>Открыть</Link>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(p.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPagesManager;
