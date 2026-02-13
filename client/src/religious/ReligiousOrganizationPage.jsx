// Современная страница религиозной организации с вкладками и всеми блоками
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ReligiousOrgProfile from './ReligiousOrgProfile';
import ReligiousOrgGallery from './ReligiousOrgGallery';
import ReligiousOrgSchedule from './ReligiousOrgSchedule';
import ReligiousOrgServices from './ReligiousOrgServices';
import ReligiousOrgProducts from './ReligiousOrgProducts';
import ReligiousOrgNews from './ReligiousOrgNews';
import ReligiousOrgTeam from './ReligiousOrgTeam';
import ReligiousOrgDocuments from './ReligiousOrgDocuments';
import ReligiousOrgContacts from './ReligiousOrgContacts';
import ReligiousOrgReviews from './ReligiousOrgReviews';



const ReligiousOrganizationPage = () => {
  const { t } = useTranslation();
  const TABS = React.useMemo(() => [
    { key: 'profile', label: t('religiousOrg.tabs.profile') },
    { key: 'gallery', label: t('religiousOrg.tabs.gallery') },
    { key: 'schedule', label: t('religiousOrg.tabs.schedule') },
    { key: 'services', label: t('religiousOrg.tabs.services') },
    { key: 'products', label: t('religiousOrg.tabs.products') },
    { key: 'news', label: t('religiousOrg.tabs.news') },
    { key: 'team', label: t('religiousOrg.tabs.team') },
    { key: 'documents', label: t('religiousOrg.tabs.documents') },
    { key: 'contacts', label: t('religiousOrg.tabs.contacts') },
    { key: 'reviews', label: t('religiousOrg.tabs.reviews') },
  ], [t]);
  const { slug } = useParams();
  const [tab, setTab] = useState('profile');
  const [org, setOrg] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      setUser(u);
    } catch (err) {
      console.error('Ошибка чтения пользователя из localStorage:', err);
    }
  }, []);

  React.useEffect(() => {
    import('../services/orgsService').then(({ default: orgsService }) => {
      orgsService.getBySlug(slug)
        .then(data => {
          setOrg(data.organization);
          setLoading(false);
        })
        .catch(() => {
          setError(t('religiousOrg.notFound'));
          setLoading(false);
        });
    });
  }, [slug, t]);

  if (loading) return <div className="p-8">{t('common.loading')}</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!org) return null;

  // Проверка владельца
  const isOwner = user && org.owner && user._id === org.owner;

  const formatAddress = (addr) => {
    if (!addr) return '';
    if (typeof addr === 'string') return addr;
    if (typeof addr === 'object') {
      const parts = [addr.street, addr.city, addr.region, addr.zipcode, addr.country].filter(Boolean);
      return parts.join(', ');
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка организации */}
      <header className="bg-white shadow p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{org.name}</h1>
          <div className="text-lg text-gray-700 mb-4">{org.description}</div>
          <div className="text-gray-500 text-sm">{formatAddress(org.contacts?.address)}</div>
          {/* Кнопка входа в кабинет только для владельца */}
          {isOwner && (
            <button
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded shadow"
              onClick={() => window.location.href = `/religious-org-cabinet/${org._id}`}
            >
              Войти в личный кабинет
            </button>
          )}
        </div>
      </header>

      {/* Навигация по вкладкам */}
      <nav className="bg-blue-50 border-b border-blue-200 px-8 py-4 flex gap-4 overflow-x-auto">
        {TABS.map(tItem => (
          <button
            key={tItem.key}
            className={`px-4 py-2 rounded font-medium transition ${tab === tItem.key ? 'bg-blue-600 text-white' : 'bg-white text-blue-900 hover:bg-blue-100'}`}
            onClick={() => setTab(tItem.key)}
          >
            {tItem.label}
          </button>
        ))}
      </nav>

      {/* Контент вкладки */}
      <main className="p-8 max-w-5xl mx-auto">
        {tab === 'profile' && <ReligiousOrgProfile organizationId={org._id} isOwner={isOwner} />}
        {tab === 'gallery' && <ReligiousOrgGallery orgId={org._id} isOwner={isOwner} />}
        {tab === 'schedule' && <ReligiousOrgSchedule orgId={org._id} isOwner={isOwner} />}
        {tab === 'services' && <ReligiousOrgServices orgId={org._id} isOwner={isOwner} />}
        {tab === 'products' && <ReligiousOrgProducts orgId={org._id} isOwner={isOwner} />}
        {tab === 'news' && <ReligiousOrgNews organizationId={org._id} isOwner={isOwner} />}
        {tab === 'team' && <ReligiousOrgTeam organizationId={org._id} isOwner={isOwner} />}
        {tab === 'documents' && <ReligiousOrgDocuments organizationId={org._id} isOwner={isOwner} />}
        {tab === 'contacts' && <ReligiousOrgContacts organizationId={org._id} isOwner={isOwner} />}
        {tab === 'reviews' && <ReligiousOrgReviews organizationId={org._id} isOwner={isOwner} />}
      </main>
    </div>
  );
};

export default ReligiousOrganizationPage;
