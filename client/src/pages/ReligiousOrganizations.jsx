import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import orgsService from '../services/orgsService';

const ReligiousOrganizations = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orgsService.list({ limit: 50 })
      .then(res => {
        setOrgs(res.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Ошибка загрузки организаций');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Каталог религиозных организаций</h1>
      {orgs.length === 0 ? (
        <div className="text-gray-600">Нет организаций</div>
      ) : (
        <ul className="space-y-4">
          {orgs.map(org => (
            <li key={org._id} className="bg-white shadow rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-lg">{org.name}</div>
                <div className="text-gray-500 text-sm">{org.confession} {org.type ? `· ${org.type}` : ''}</div>
                <div className="text-gray-400 text-xs">{org.contacts?.address?.city}</div>
              </div>
              <Link to={`/religious-organizations/${org.slug || org._id}`} className="mt-2 md:mt-0 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Подробнее</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReligiousOrganizations;
