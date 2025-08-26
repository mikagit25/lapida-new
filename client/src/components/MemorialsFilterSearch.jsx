import React, { useState } from 'react';

/**
 * MemorialsFilterSearch
 * Фильтры и расширенный поиск для страницы мемориалов
 * Props:
 *   onFilterChange: (filters) => void
 */
const MemorialsFilterSearch = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [hasEpitaph, setHasEpitaph] = useState(false);

  const handleChange = () => {
    onFilterChange({
      searchTerm,
      dateFrom,
      dateTo,
      gender,
      country,
      city,
      hasPhoto,
      hasEpitaph,
    });
  };

  // Вызываем handleChange при изменении любого фильтра
  React.useEffect(() => {
    handleChange();
    // eslint-disable-next-line
  }, [searchTerm, dateFrom, dateTo, gender, country, city, hasPhoto, hasEpitaph]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Поиск по имени, фамилии, эпитафии..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Дата от"
        />
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Дата до"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={gender}
          onChange={e => setGender(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Пол</option>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другое</option>
        </select>
        <input
          type="text"
          value={country}
          onChange={e => setCountry(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Страна"
        />
        <input
          type="text"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Город"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasPhoto}
            onChange={e => setHasPhoto(e.target.checked)}
          />
          С фото
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={hasEpitaph}
            onChange={e => setHasEpitaph(e.target.checked)}
          />
          С эпитафией
        </label>
      </div>
    </div>
  );
};

export default MemorialsFilterSearch;
