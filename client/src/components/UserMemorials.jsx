import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/api';

const UserMemorials = () => {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0
  });

  useEffect(() => {
    fetchMemorials();
  }, []);

  const fetchMemorials = async (page = 1) => {
    try {
      setLoading(true);
      const response = await userService.getMyMemorials({ page, limit: 6 });
      setMemorials(response.memorials || []);
      setPagination(response.pagination || { current: 1, total: 1, count: 0 });
    } catch (error) {
      console.error('Error fetching memorials:', error);
      setError('Ошибка при загрузке мемориалов: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchMemorials(page);
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Мои мемориалы</h2>
        </div>
        <div className="px-6 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка мемориалов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Мои мемориалы</h2>
          <Link
            to="/create-memorial"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Создать новый
          </Link>
        </div>
      </div>

      <div className="px-6 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {memorials.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Нет созданных мемориалов</h3>
            <p className="mt-2 text-gray-500">Начните с создания первого мемориала в память о близком человеке.</p>
            <Link
              to="/create-memorial"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Создать мемориал
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memorials.map((memorial) => (
                <div key={memorial._id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={memorial.photo || memorial.profileImage || 'https://via.placeholder.com/400x225?text=Фото+недоступно'}
                      alt={`${memorial.firstName} ${memorial.lastName}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {memorial.firstName} {memorial.lastName}
                    </h3>
                    <div className="text-sm text-gray-600 mb-3">
                      <p>{memorial.birthDate} — {memorial.deathDate}</p>
                      {memorial.location && memorial.location.cemetery && <p className="mt-1">{memorial.location.cemetery}</p>}
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Создан: {new Date(memorial.createdAt).toLocaleDateString('ru-RU')}</span>
                      <span className={`px-2 py-1 rounded-full ${!memorial.isPrivate ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {!memorial.isPrivate ? 'Публичный' : 'Приватный'}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Link
                        to={memorial.customSlug ? `/${memorial.customSlug}` : `/memorial/${memorial._id}`}
                        className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        Просмотр
                      </Link>
                      <Link
                        to={memorial.customSlug ? `/${memorial.customSlug}` : `/memorial/${memorial._id}`}
                        className="flex-1 bg-gray-600 text-white text-center py-2 px-3 rounded-md hover:bg-gray-700 transition-colors text-sm"
                      >
                        Управление
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Пагинация */}
            {pagination.total > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={pagination.current === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Предыдущая
                  </button>
                  
                  {[...Array(pagination.total)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.current
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={pagination.current === pagination.total}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Следующая
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserMemorials;
