import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// TODO: заменить на реальный API для компаний
const mockCompanies = [
  { _id: '1', name: 'ООО "Ромашка"', inn: '1234567890', owner: 'Иванов И.И.', isHidden: false },
  { _id: '2', name: 'ЗАО "Лютик"', inn: '0987654321', owner: 'Петров П.П.', isHidden: false },
];


const AdminCompaniesManager = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        setError('');
        const { companyService } = await import('../services/api');
        const response = await companyService.getAll();
        setCompanies(Array.isArray(response) ? response : response.companies || []);
      } catch (err) {
  setError(t('admin_companies_error_loading'));
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const handleHide = (id) => {
    setCompanies(cs => cs.map(c => c._id === id ? { ...c, isHidden: !c.isHidden } : c));
    // TODO: PATCH /api/companies/:id/hide
  };

  const handleDelete = (id) => {
  if (window.confirm(t('admin_companies_confirm_delete'))) {
      setCompanies(cs => cs.filter(c => c._id !== id));
      // TODO: DELETE /api/companies/:id
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-semibold mb-4">{t('admin_companies_title')}</h2>
      {loading ? (
        <div>{t('admin_companies_loading')}</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr>
              <th className="border px-2 py-1">{t('admin_companies_col_name')}</th>
              <th className="border px-2 py-1">{t('admin_companies_col_inn')}</th>
              <th className="border px-2 py-1">{t('admin_companies_col_owner')}</th>
              <th className="border px-2 py-1">{t('admin_companies_col_status')}</th>
              <th className="border px-2 py-1">{t('admin_companies_col_actions')}</th>
            </tr>
          </thead>
          <tbody>
            {companies.map(c => (
              <tr key={c._id}>
                <td className="border px-2 py-1">{c.name}</td>
                <td className="border px-2 py-1">{c.inn}</td>
                <td className="border px-2 py-1">{c.owner}</td>
                <td className="border px-2 py-1">{c.isHidden ? t('admin_companies_hidden') : t('admin_companies_active')}</td>
                <td className="border px-2 py-1">
                  <button className="text-yellow-600 hover:underline mr-2" onClick={() => handleHide(c._id)}>
                    {c.isHidden ? t('admin_companies_show') : t('admin_companies_hide')}
                  </button>
                  <Link className="text-blue-600 hover:underline mr-2" to={`/company-cabinet/${c._id}`}>{t('admin_companies_open')}</Link>
                  <button className="text-red-600 hover:underline" onClick={() => handleDelete(c._id)}>{t('admin_companies_delete')}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCompaniesManager;
