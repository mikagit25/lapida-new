import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';
import CompanyRegionSearch from '../components/CompanyRegionSearch';

const Companies = () => {
  const { t } = useTranslation();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [region, setRegion] = useState('');
  const [sort, setSort] = useState('newest'); // newest, oldest, nearest
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`${API_BASE_URL}/companies`);
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (e) {
      console.error('Ошибка загрузки компаний:', e);
      setError('Ошибка загрузки компаний');
    } finally {
      setLoading(false);
    }
  };

  // Геокодирование адреса (используем Nominatim)
  const geocodeRegion = async (address) => {
    if (!address) return null;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  };

  // Поиск ближайших компаний к региону
  const handleGeoSearch = async () => {
    if (!region) return;
    const coords = await geocodeRegion(region);
    if (coords) setUserCoords(coords);
  };

  // Получить координаты пользователя через браузер
  const handleDetectMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => alert('Не удалось определить местоположение')
      );
    }
  };

  // Функция для вычисления расстояния между двумя точками (Haversine)
  function getDistance(lat1, lon1, lat2, lon2) {
    function toRad(x) { return x * Math.PI / 180; }
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Сортировка компаний
  let sorted = [...companies];
  if (sort === 'newest') {
    sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sort === 'oldest') {
    sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sort === 'nearest' && userCoords) {
    sorted = sorted
      .filter(c => typeof c.lat === 'number' && typeof c.lng === 'number')
      .map(c => ({ ...c, _distance: getDistance(userCoords.lat, userCoords.lng, c.lat, c.lng) }))
      .sort((a, b) => a._distance - b._distance);
  }

  // Фильтрация
  const filtered = sorted.filter(c => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === 'verified' && c.status !== 'verified') return false;
    if (filter === 'pending' && c.status !== 'pending') return false;
    if (region && c.address && !c.address.toLowerCase().includes(region.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <h1 className="text-3xl font-bold mb-6">{t('companies_title')}</h1>
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <input
            type="text"
            placeholder={t('search_by_name')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="all">{t('all')}</option>
            <option value="verified">{t('verified')}</option>
            <option value="pending">{t('pending')}</option>
          </select>
          <CompanyRegionSearch region={region} setRegion={setRegion} onGeoSearch={handleGeoSearch} />
          <button
            className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 text-sm"
            onClick={() => setSort(sort === 'newest' ? 'oldest' : 'newest')}
            type="button"
          >
            {sort === 'newest' ? t('sort_newest') : t('sort_oldest')}
          </button>
          <button
            className="bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 text-sm"
            onClick={handleDetectMe}
            type="button"
          >
            {t('nearest_to_me')}
          </button>
        </div>
        {loading ? (
          <div>{t('loading')}</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : filtered.length === 0 ? (
          <div>{t('no_companies_found')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(company => (
              <div key={company._id} className="bg-white rounded-lg shadow p-6 flex flex-col">
                {company.avatar && (
                  <img
                    src={company.avatar}
                    alt={company.name + ' аватар'}
                    className="w-20 h-20 object-cover rounded-full mx-auto mb-3 border"
                  />
                )}
                <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
                <p className="text-gray-600 mb-2">{company.address}</p>
                <p className="text-gray-500 mb-2">{t('inn')}: {company.inn}</p>
                <p className="text-sm mb-2">{company.description}</p>
                <div className="flex-1" />
                <div className="flex items-center gap-2 mt-2">
                  {company.status === 'verified' && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">{t('verified')}</span>
                  )}
                  {company.status === 'pending' && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">{t('pending')}</span>
                  )}
                </div>
                <Link
                  to={company.customSlug ? `/company/${company.customSlug}` : `/company/${company._id}`}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
                >
                  {t('more_details')}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
