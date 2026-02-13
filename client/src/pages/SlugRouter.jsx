import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MemorialView from './MemorialView';
import { newMemorialService } from '../services/api';

export default function SlugRouter() {
  const { slug } = useParams();
  const [type, setType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memorial, setMemorial] = useState(null);

  useEffect(() => {
    let active = true;
    async function fetchData() {
      setLoading(true);
      setType(null);
      setMemorial(null);
      // Only try to find memorials by slug
      try {
        const memorialData = await newMemorialService.getBySlug(slug);
        if (memorialData && memorialData._id) {
          if (active) {
            setType('memorial');
            setMemorial(memorialData);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Ошибка поиска мемориала по slug:', e);
      }
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
  return <div className="min-h-screen flex items-center justify-center text-red-600">Страница не найдена</div>;
}
