import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const CompanyRecommendations = ({ companyId, category }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE_URL}/companies/recommendations?category=${encodeURIComponent(category || '')}&exclude=${companyId}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.companies)) {
          setCompanies(data.companies);
        } else {
          setError(data.message || 'Ошибка загрузки рекомендаций');
        }
      } catch (e) {
        console.error('Ошибка загрузки рекомендаций', e);
        setError('Ошибка загрузки рекомендаций');
      }
      setLoading(false);
    }
    if (category && companyId) fetchRecommendations();
  }, [category, companyId]);

  if (!category) return null;
  if (loading) return <div className="text-gray-500">Загрузка похожих компаний...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!companies.length) return null;

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Похожие компании</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {companies.map(c => (
          <Link key={c._id} to={c.customSlug ? `/company/${c.customSlug}` : `/company/${c._id}`}
            className="block bg-white rounded shadow p-4 hover:bg-blue-50 transition">
            <div className="font-semibold mb-1">{c.name}</div>
            {c.description && <div className="text-gray-600 text-sm mb-2">{c.description}</div>}
            {c.address && <div className="text-xs text-gray-400">{c.address}</div>}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CompanyRecommendations;
