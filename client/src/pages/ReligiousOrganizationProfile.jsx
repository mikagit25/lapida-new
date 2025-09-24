

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import religiousOrgService from '../services/religiousOrgService';
import OrganizationAvatar from '../components/OrganizationAvatar';
import OrganizationGallery from '../components/OrganizationGallery';
import OrganizationSchedule from '../components/OrganizationSchedule';
import OrganizationServices from '../components/OrganizationServices';
import OrganizationProducts from '../components/OrganizationProducts';
import OrganizationDocuments from '../components/OrganizationDocuments';
import OrganizationNews from '../components/OrganizationNews';
import OrganizationTeam from '../components/OrganizationTeam';
import OrganizationContacts from '../components/OrganizationContacts';
import OrganizationDescription from '../components/OrganizationDescription';

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-blue-800">{title}</h2>
    {children}
  </section>
);


const ReligiousOrganizationProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Получить текущего пользователя из localStorage
    try {
      const u = JSON.parse(localStorage.getItem('user'));
      setUser(u);
    } catch {}
  }, []);

  useEffect(() => {
    religiousOrgService.getById(id)
      .then(data => {
        setOrg(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Организация не найдена');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!org) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header: Logo, Name, Type, Confession */}
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-8">
        <OrganizationAvatar logo={org.logo} name={org.name} />
        <div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">{org.name}</h1>
          <div className="text-gray-700 text-lg mb-1">{org.confession} {org.type ? `· ${org.type}` : ''}</div>
          <div className="text-gray-500 text-sm">{org.contacts?.address}</div>
          {/* Кнопка входа в личный кабинет только для создателя */}
          {user && org.owner && user._id === org.owner && (
            <button
              className="mt-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded shadow"
              onClick={() => navigate(`/religious-org-cabinet/${org._id}`)}
            >
              Войти в личный кабинет
            </button>
          )}
        </div>
      </div>

      {/* Описание */}
      {org.description && (
        <Section title="Описание">
          <OrganizationDescription description={org.description} />
        </Section>
      )}

      {/* Контакты */}
      <Section title="Контакты">
        <OrganizationContacts contacts={org.contacts} />
      </Section>

      {/* Галерея */}
      {org.photos && org.photos.length > 0 && (
        <Section title="Галерея">
          <OrganizationGallery photos={org.photos} />
        </Section>
      )}

      {/* Расписание */}
      {org.schedule && org.schedule.length > 0 && (
        <Section title="Расписание">
          <OrganizationSchedule schedule={org.schedule} />
        </Section>
      )}

      {/* Услуги */}
      {org.services && org.services.length > 0 && (
        <Section title="Услуги">
          <OrganizationServices services={org.services} />
        </Section>
      )}

      {/* Товары */}
      {org.products && org.products.length > 0 && (
        <Section title="Товары и церковная лавка">
          <OrganizationProducts products={org.products} />
        </Section>
      )}

      {/* Документы */}
      {org.documents && org.documents.length > 0 && (
        <Section title="Документы">
          <OrganizationDocuments documents={org.documents} />
        </Section>
      )}

      {/* Новости */}
      {org.news && org.news.length > 0 && (
        <Section title="Новости">
          <OrganizationNews news={org.news} />
        </Section>
      )}

      {/* Команда */}
      {org.team && org.team.length > 0 && (
        <Section title="Команда">
          <OrganizationTeam team={org.team} />
        </Section>
      )}
    </div>
  );
};

export default ReligiousOrganizationProfile;
