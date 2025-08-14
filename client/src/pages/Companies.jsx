import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/companies');
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (e) {
      setError('Ошибка загрузки компаний');
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'verified' && c.status !== 'verified') return false;
    if (filter === 'pending' && c.status !== 'pending') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Каталог компаний</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Поиск по названию..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="all">Все</option>
            <option value="verified">Проверенные</option>
            <option value="pending">На проверке</option>
          </select>
        </div>
        {loading ? (
          <div>Загрузка...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div>Нет компаний по вашему запросу.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(company => (
              <div key={company._id} className="bg-white rounded-lg shadow p-6 flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
                <p className="text-gray-600 mb-2">{company.address}</p>
                <p className="text-gray-500 mb-2">ИНН: {company.inn}</p>
                <p className="text-sm mb-2">{company.description}</p>
                <div className="flex-1" />
                <div className="flex items-center gap-2 mt-2">
                  {company.status === 'verified' && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Проверенная</span>
                  )}
                  {company.status === 'pending' && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">На проверке</span>
                  )}
                </div>
                <Link to={`/companies/${company._id}`} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">Подробнее</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
