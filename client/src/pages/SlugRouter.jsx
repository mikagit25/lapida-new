import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MemorialView from './MemorialView';
import CompanyProfile from './CompanyProfile';
import { newMemorialService } from '../services/api';

export default function SlugRouter() {
  const { slug } = useParams();
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memorial, setMemorial] = useState(null);
  const [company, setCompany] = useState(null);
  // Получаем userData из localStorage
  const userData = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    let active = true;
    async function fetchData() {
      setLoading(true);
      setType(null);
      setMemorial(null);
      setCompany(null);
      try {
        // Пробуем найти мемориал
        const memorialData = await newMemorialService.getBySlug(slug);
        if (memorialData && memorialData._id) {
          if (active) {
            setType('memorial');
            setMemorial(memorialData);
            setLoading(false);
            return;
          }
        }
      } catch (e) {}
      try {
        // Пробуем найти компанию
        const res = await fetch(`/api/companies/by-slug/${slug}`);
        const data = await res.json();
        if (res.ok && data.company && data.company._id) {
          if (active) {
            setType('company');
            setCompany(data.company);
            setLoading(false);
            return;
          }
        }
      } catch (e) {}
      if (active) {
        setType('notfound');
        setLoading(false);
      }
    }
    fetchData();
    return () => { active = false; };
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Загрузка...</div>;
  if (type === 'memorial') return <MemorialView memorial={memorial} />;
  if (type === 'company') return <CompanyProfile company={company} userData={userData} />;
  return <div className="min-h-screen flex items-center justify-center text-red-600">Страница не найдена</div>;
}
