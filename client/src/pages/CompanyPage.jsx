import { apiFetch } from '../services/apiFetch';

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import CompanyProfile from './CompanyProfile';
import { useAuth } from '../context/AuthContext';

export default function CompanyPage() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isLoading, isAuthenticated } = useAuth();
  console.log('CompanyPage useAuth user:', user);

  useEffect(() => {
    setLoading(true);
    let url = '';
    if (id) {
      // Если id похож на ObjectId (24 hex символа) — ищем по id, иначе по customSlug
      if (/^[a-f\d]{24}$/i.test(id)) {
        url = `/api/companies/${id}`;
      } else {
        url = `/api/companies/by-slug/${id}`;
      }
    } else {
      setError('Некорректный адрес компании');
      setLoading(false);
      return;
    }
    apiFetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Компания не найдена');
        return res.json();
      })
      .then(data => {
        if (data.company) {
          setCompany(data.company);
        } else {
          setError('Компания не найдена');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Компания не найдена');
        setLoading(false);
      });
  }, [id, location.pathname]);

  if (loading || isLoading || !isAuthenticated || !user || !user._id) {
    return (
      <div className="p-8">
        <div>Загрузка пользователя...</div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!company) return <div className="p-8">Компания не найдена</div>;

  const news = company.news || [];
  const team = company.team || [];
  const contacts = company.contacts || {};

  console.log('CompanyPage user:', user);
  if (!user || !user._id) {
    return (
      <div className="p-8">
        <div>Загрузка пользователя...</div>
      </div>
    );
  }
  return (
    <CompanyProfile company={company} userData={user} news={news} team={team} contacts={contacts} />
  );
}

