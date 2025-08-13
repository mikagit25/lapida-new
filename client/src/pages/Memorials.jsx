import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newMemorialService } from '../services/api';

const Memorials = () => {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadMemorials();
  }, []);

  const loadMemorials = async () => {
    try {
      setLoading(true);
      const data = await newMemorialService.getAll();
      console.log('Memorials - loaded data:', data);
      setMemorials(data);
    } catch (error) {
      console.error('Error loading memorials:', error);
      setError('Ошибка при загрузке мемориалов');
    } finally {
      setLoading(false);
    }
  };

  const filteredMemorials = memorials.filter(memorial =>
    memorial.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMemorials = [...filteredMemorials].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'name':
        return a.fullName.localeCompare(b.fullName);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка мемориалов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Мемориалы</h1>
          <p className="text-gray-600 mb-6">
            Сохраните память о близких и поделитесь их историями
          </p>

          {/* Поиск и фильтры */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Сначала новые</option>
              <option value="oldest">Сначала старые</option>
              <option value="name">По имени</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={loadMemorials}
              className="ml-4 text-red-800 underline hover:text-red-900"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {sortedMemorials.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📖</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm 
                ? 'Мемориалы не найдены' 
                : 'Пока нет мемориалов'
              }
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Попробуйте изменить поисковый запрос' 
                : 'Станьте первым, кто создаст мемориал'
              }
            </p>
            {!searchTerm && (
              <Link
                to="/create-memorial"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Создать мемориал
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMemorials.map((memorial) => (
              <div key={memorial._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  {memorial.profileImage ? (
                    <img
                      src={memorial.profileImage}
                      alt={memorial.fullName}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4">
                    <h3 className="text-white text-lg font-semibold">{memorial.fullName}</h3>
                    <p className="text-white text-sm opacity-90">{memorial.lifespan}</p>
                  </div>
                </div>
                
                <div className="p-4">
                  {memorial.epitaph && (
                    <blockquote className="text-gray-700 italic text-sm mb-3 line-clamp-2">
                      "{memorial.epitaph}"
                    </blockquote>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Просмотров: {memorial.views || 0}</span>
                    <span>{new Date(memorial.createdAt).toLocaleDateString('ru-RU')}</span>
                  </div>
                  
                  <Link
                    to={memorial.customSlug ? `/${memorial.customSlug}` : `/memorial/${memorial.shareUrl}`}
                    className="w-full bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 inline-block"
                    onClick={() => console.log('Memorials - clicking memorial with shareUrl:', memorial.shareUrl)}
                  >
                    Посетить мемориал
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Memorials;
