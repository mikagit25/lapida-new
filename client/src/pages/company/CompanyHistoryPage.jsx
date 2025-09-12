import React from 'react';
import { useParams } from 'react-router-dom';
import CompanyHistory from '../../components/CompanyHistory';
import { useAuth } from '../../context/AuthContext';
import { apiFetch } from '../../services/apiFetch';
import { API_BASE_URL } from '../../config/api';

export default function CompanyHistoryPage() {
  const { id } = useParams();
  const [company, setCompany] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const { user } = useAuth();

  React.useEffect(() => {
    async function fetchCompany() {
      setLoading(true);
      setError('');
      try {
        const res = await apiFetch(`${API_BASE_URL}/companies/${id}`);
        const data = await res.json();
        if (res.ok && data.company) {
          setCompany(data.company);
        } else {
          setError(data.message || 'Компания не найдена');
        }
      } catch (e) {
        setError('Ошибка загрузки компании');
      }
      setLoading(false);
    }
    if (id) fetchCompany();
  }, [id]);

  if (loading) return <div className="text-gray-500">Загрузка...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!company) return null;

  const userId = user?._id || user?.id;
  const isOwner = userId && company.owner?.toString() === userId.toString();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">История компании: {company.name}</h1>
      <CompanyHistory companyId={company._id} isOwner={isOwner} />
    </div>
  );
}
