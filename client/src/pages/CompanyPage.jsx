
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CompanyProfile from './CompanyProfile';
import { useAuth } from '../context/AuthContext';

export default function CompanyPage() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/companies/${id}`)
      .then(res => res.json())
      .then(data => {
        setCompany(data.company);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка загрузки');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!company) return <div className="p-8">Компания не найдена</div>;

  const news = company.news || [];
  const team = company.team || [];
  const contacts = company.contacts || {};

  return <CompanyProfile company={company} user={user} news={news} team={team} contacts={contacts} />;
}

