
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import CompanyProfile from './CompanyProfile';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { apiFetch } from '../services/apiFetch';

export default function CompanyPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const location = useLocation();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isLoading, isAuthenticated } = useAuth();

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
        setError(t('company_invalid_address'));
      setLoading(false);
      return;
    }
    apiFetch(url)
      .then(res => {
  if (!res.ok) throw new Error(t('company_not_found'));
        return res.json();
      })
      .then(data => {
        if (data.company) {
          setCompany(data.company);
        } else {
          setError(t('company_not_found'));
        }
        setLoading(false);
      })
      .catch(() => {
        setError(t('company_not_found'));
        setLoading(false);
      });
  }, [id, location.pathname, t]);

  if (loading || isLoading || !isAuthenticated || !user || !user._id) {
    return (
      <div className="p-8">
        <div>{t('loading_user')}</div>
      </div>
    );
  }

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!company) return <div className="p-8">{t('company_not_found')}</div>;

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

