import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// TODO: заменить на реальный API для мемориалов
const mockMemorials = [
  { _id: 'm1', title: 'Иванов Иван Иванович', createdBy: 'user1', isPublic: true, isHidden: false },
  { _id: 'm2', title: 'Петров Петр Петрович', createdBy: 'user2', isPublic: false, isHidden: false },
];


const AdminMemorialsManager = () => {
  const { t } = useTranslation();
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
  setError(t('admin_memorials_error_loading'));
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
  if (window.confirm(t('admin_memorials_confirm_delete'))) {
      const deleteMemorial = async () => {
        try {
          const { newMemorialService } = await import('../services/api');
          await newMemorialService.remove(id);
          setMemorials(ms => ms.filter(m => m._id !== id));
        } catch (err) {
          alert(t('admin_memorials_error_delete'));
        }
      };
      deleteMemorial();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">
        {t('admin_memorials_title')}
        {memorials.length === 1 && memorials[0].title ? `: ${memorials[0].title}` : ''}
      </h2>
      {loading ? (
        <div>{t('admin_memorials_loading')}</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border px-2 py-1">{t('admin_memorials_col_name')}</th>
              <th className="border px-2 py-1">{t('admin_memorials_col_title')}</th>
              <th className="border px-2 py-1">{t('admin_memorials_col_author')}</th>
              <th className="border px-2 py-1">{t('admin_memorials_col_public')}</th>
              <th className="border px-2 py-1">{t('admin_memorials_col_status')}</th>
              <th className="border px-2 py-1">{t('admin_memorials_col_actions')}</th>
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
                <td className="border px-2 py-1">{m.isPublic ? t('admin_memorials_yes') : t('admin_memorials_no')}</td>
                <td className="border px-2 py-1">{m.isHidden ? t('admin_memorials_hidden') : t('admin_memorials_active')}</td>
                <td className="border px-2 py-1">
                  <button className="text-yellow-600 hover:underline mr-2" onClick={() => handleHide(m._id)}>
                    {m.isHidden ? t('admin_memorials_show') : t('admin_memorials_hide')}
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
                  >{t('admin_memorials_open')}</Link>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(m._id)}>{t('admin_memorials_delete')}</button>
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
