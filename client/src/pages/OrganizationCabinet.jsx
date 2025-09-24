import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import religiousOrgService from '../services/religiousOrgService';
import OrganizationProfileEdit from '../components/OrganizationProfileEdit';
import OrganizationGalleryEdit from '../components/OrganizationGalleryEdit';
import OrganizationScheduleEdit from '../components/OrganizationScheduleEdit';
import OrganizationServicesEdit from '../components/OrganizationServicesEdit';
import OrganizationProductsEdit from '../components/OrganizationProductsEdit';
import OrganizationDocumentsEdit from '../components/OrganizationDocumentsEdit';
import OrganizationNewsEdit from '../components/OrganizationNewsEdit';
import OrganizationTeamEdit from '../components/OrganizationTeamEdit';
import OrganizationContactsEdit from '../components/OrganizationContactsEdit';

const OrganizationCabinet = () => {
  const { id } = useParams();
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // TODO: добавить auth-проверку и защиту

  useEffect(() => {
    setLoading(true);
    setError('');
    religiousOrgService.getById(id)
      .then(data => {
        // Если вдруг приходит массив, берём первый элемент
        const orgObj = Array.isArray(data) ? data[0] : data;
        console.log('OrganizationCabinet org:', orgObj);
        setOrg(orgObj);
        setLoading(false);
      })
      .catch((err) => {
        setError('Организация не найдена');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error || !org || !org._id) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-700 mb-2">Организация не найдена</h2>
        <div className="text-gray-600">Возможно, у вас нет доступа или организация была удалена.</div>
        <pre style={{textAlign: 'left', margin: '2em auto', maxWidth: 600, background: '#eee', padding: 10}}>
          {JSON.stringify(org, null, 2)}
        </pre>
        <pre style={{textAlign: 'left', margin: '2em auto', maxWidth: 600, background: '#eee', padding: 10}}>
          {error && String(error)}
        </pre>
      </div>
    );
  }

  // Заглушки onSave для каждого блока (реализовать API-запросы по необходимости)
  const handleProfileSave = async (profile) => {
    // TODO: реализовать сохранение профиля
    console.log('Save profile', profile);
  };
  const handleGallerySave = async (photos) => {
    // TODO: реализовать сохранение галереи
    console.log('Save gallery', photos);
  };
  const handleScheduleSave = async (schedule) => {
    // TODO: реализовать сохранение расписания
    console.log('Save schedule', schedule);
  };
  const handleServicesSave = async (services) => {
    // TODO: реализовать сохранение услуг
    console.log('Save services', services);
  };
  const handleProductsSave = async (products) => {
    // TODO: реализовать сохранение товаров
    console.log('Save products', products);
  };
  const handleDocumentsSave = async (documents) => {
    // TODO: реализовать сохранение документов
    console.log('Save documents', documents);
  };
  const handleNewsSave = async (news) => {
    // TODO: реализовать сохранение новостей
    console.log('Save news', news);
  };
  const handleTeamSave = async (team) => {
    // TODO: реализовать сохранение команды
    console.log('Save team', team);
  };
  const handleContactsSave = async (contacts) => {
    // TODO: реализовать сохранение контактов
    console.log('Save contacts', contacts);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Личный кабинет организации: {org.name}</h1>
      <div className="space-y-8">
        <OrganizationProfileEdit org={org} onSave={handleProfileSave} />
        <OrganizationGalleryEdit photos={org.photos || []} onSave={handleGallerySave} />
        <OrganizationScheduleEdit schedule={org.schedule || []} onSave={handleScheduleSave} />
        <OrganizationServicesEdit services={org.services || []} onSave={handleServicesSave} />
        <OrganizationProductsEdit products={org.products || []} onSave={handleProductsSave} />
        <OrganizationDocumentsEdit documents={org.documents || []} onSave={handleDocumentsSave} />
        <OrganizationNewsEdit news={org.news || []} onSave={handleNewsSave} />
        <OrganizationTeamEdit team={org.team || []} onSave={handleTeamSave} />
        <OrganizationContactsEdit contacts={org.contacts || []} onSave={handleContactsSave} />
      </div>
    </div>
  );
};

export default OrganizationCabinet;
