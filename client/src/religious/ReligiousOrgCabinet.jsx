// Главный кабинет религиозной организации (панель управления)

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ReligiousOrgProfile from './ReligiousOrgProfile';
import ReligiousOrgServices from './ReligiousOrgServices';
import ReligiousOrgProducts from './ReligiousOrgProducts';
import ReligiousOrgOrders from './ReligiousOrgOrders';
import ReligiousOrgReviews from './ReligiousOrgReviews';
import ReligiousOrgGallery from './ReligiousOrgGallery';
import ReligiousOrgTeam from './ReligiousOrgTeam';
import ReligiousOrgContacts from './ReligiousOrgContacts';
import ReligiousOrgDocuments from './ReligiousOrgDocuments';
import ReligiousOrgNews from './ReligiousOrgNews';
import ReligiousOrgSchedule from './ReligiousOrgSchedule';

const SECTIONS = [
  { key: 'profile', label: 'religiousOrgCabinet.menu.profile' },
  { key: 'gallery', label: 'religiousOrgCabinet.menu.gallery' },
  { key: 'schedule', label: 'religiousOrgCabinet.menu.schedule' },
  { key: 'services', label: 'religiousOrgCabinet.menu.services' },
  { key: 'products', label: 'religiousOrgCabinet.menu.products' },
  { key: 'orders', label: 'religiousOrgCabinet.menu.orders' },
  { key: 'team', label: 'religiousOrgCabinet.menu.team' },
  { key: 'contacts', label: 'religiousOrgCabinet.menu.contacts' },
  { key: 'documents', label: 'religiousOrgCabinet.menu.documents' },
  { key: 'news', label: 'religiousOrgCabinet.menu.news' },
  { key: 'reviews', label: 'religiousOrgCabinet.menu.reviews' },
];

const ReligiousOrgCabinet = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [section, setSection] = useState('profile');
  const [org, setOrg] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Получить текущего пользователя из localStorage
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      setUser(u);
    } catch {}
  }, []);

  useEffect(() => {
    import('../services/religiousOrgService').then(({ default: religiousOrgService }) => {
      religiousOrgService.getById(id)
        .then(data => {
          setOrg(data);
          setLoading(false);
        })
        .catch(() => {
          setError(t('religiousOrgCabinet.notFound'));
          setLoading(false);
        });
    });
  }, [id, t]);

  if (loading) return <div className="p-8">{t('common.loading')}</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!org) return null;
  if (!user || user._id !== org.owner) {
    return <div className="p-8 text-red-600">{t('religiousOrgCabinet.ownerOnly')}</div>;
  }

  const renderSection = () => {
    switch (section) {
      case 'profile':
        return <ReligiousOrgProfile organizationId={id} />;
      case 'gallery':
        return <ReligiousOrgGallery orgId={id} />;
      case 'schedule':
        return <ReligiousOrgSchedule orgId={id} />;
      case 'services':
        return <ReligiousOrgServices orgId={id} />;
      case 'products':
        return <ReligiousOrgProducts orgId={id} />;
      case 'orders':
        return <ReligiousOrgOrders orgId={id} />;
      case 'team':
        return <ReligiousOrgTeam organizationId={id} />;
      case 'contacts':
        return <ReligiousOrgContacts organizationId={id} />;
      case 'documents':
        return <ReligiousOrgDocuments organizationId={id} />;
      case 'news':
        return <ReligiousOrgNews organizationId={id} />;
      case 'reviews':
        return <ReligiousOrgReviews organizationId={id} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-8 text-blue-900">{t('religiousOrgCabinet.title')}</h1>
        <nav className="flex-1">
          <ul className="space-y-2">
            {SECTIONS.map(s => (
              <li key={s.key}>
                <button
                  className={`w-full text-left px-4 py-2 rounded transition font-medium ${section === s.key ? 'bg-blue-100 text-blue-900' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => setSection(s.key)}
                >
                  {t(s.label)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <div className="mb-6 text-gray-700 bg-blue-50 border-l-4 border-blue-300 p-4 rounded">
          {t(`religiousOrgCabinet.help.${section}`)}
        </div>
        {renderSection()}
      </main>
    </div>
  );
};

export default ReligiousOrgCabinet;
