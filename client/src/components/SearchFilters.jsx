import React, { useState } from 'react';

const SearchFilters = ({ onFiltersChange, onReset }) => {
  const [filters, setFilters] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    birthPlace: '',
    burialPlace: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      name: '',
      birthDate: '',
      deathDate: '',
      birthPlace: '',
      burialPlace: '',
      sortBy: 'name',
      sortOrder: 'asc'
    };
    setFilters(resetFilters);
    onFiltersChange(resetFilters);
    onReset();
  };

  const sortOptions = [
    { value: 'name', label: 'По имени' },
    { value: 'birthDate', label: 'По дате рождения' },
    { value: 'deathDate', label: 'По дате смерти' },
    { value: 'birthPlace', label: 'По месту рождения' },
    { value: 'burialPlace', label: 'По месту захоронения' },
    { value: 'createdAt', label: 'По дате создания' }
  ];

  return (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
      {/* Header with toggle */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Расширенные фильтры</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? 'Свернуть' : 'Развернуть'}
          <svg
            className={`ml-1 h-4 w-4 transform transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filters content */}
      {isExpanded && (
        <div className="space-y-4">
          {/* Basic filters row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя/Фамилия
              </label>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                placeholder="Введите имя или фамилию"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Birth place filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Место рождения
              </label>
              <input
                type="text"
                value={filters.birthPlace}
                onChange={(e) => handleFilterChange('birthPlace', e.target.value)}
                placeholder="Город, страна"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Burial place filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Место захоронения
              </label>
              <input
                type="text"
                value={filters.burialPlace}
                onChange={(e) => handleFilterChange('burialPlace', e.target.value)}
                placeholder="Кладбище, город"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Date filters row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Birth date filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата рождения
              </label>
              <input
                type="date"
                value={filters.birthDate}
                onChange={(e) => handleFilterChange('birthDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Death date filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата смерти
              </label>
              <input
                type="date"
                value={filters.deathDate}
                onChange={(e) => handleFilterChange('deathDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Sorting options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort by */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Сортировать по
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Порядок сортировки
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Сбросить фильтры
            </button>
            
            <div className="text-sm text-gray-500">
              Настройте фильтры для точного поиска
            </div>
          </div>
        </div>
      )}

      {/* Compact view when collapsed */}
      {!isExpanded && (
        <div className="text-sm text-gray-500">
          Нажмите "Развернуть" для доступа к расширенным фильтрам поиска
        </div>
      )}
    </div>
  );
};

export default SearchFilters;