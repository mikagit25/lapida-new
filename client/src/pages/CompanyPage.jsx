
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
    // Определяем, есть ли customSlug в URL
    const pathParts = location.pathname.split('/').filter(Boolean);
    const possibleSlug = pathParts.length === 1 ? pathParts[0] : null;
    let url = '';
    if (possibleSlug) {
      url = `/api/companies/by-slug/${possibleSlug}`;
    } else if (id) {
      url = `/api/companies/${id}`;
    }
    if (!url) {
      setError('Некорректный адрес компании');
      setLoading(false);
      return;
    }
    fetch(url)
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
        <div>user: {JSON.stringify(user)}</div>
        <div>user._id: {user?._id?.toString()} (type: {typeof user?._id})</div>
        <div>isAuthenticated: {String(isAuthenticated)}</div>
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
        <div>user: {JSON.stringify(user)}</div>
        <div>user._id: {user?._id?.toString()} (type: {typeof user?._id})</div>
        <div>isAuthenticated: {String(isAuthenticated)}</div>
      </div>
    );
  }
  return (
    <>
      <div style={{fontSize:'12px',color:'#888',marginBottom:'8px'}}>
        <div>user: {JSON.stringify(user)}</div>
        <div>user._id: {user._id?.toString()} (type: {typeof user._id})</div>
        <div>isAuthenticated: {String(isAuthenticated)}</div>
      </div>
      <CompanyProfile company={company} userData={user} news={news} team={team} contacts={contacts} />
    </>
  );
}

