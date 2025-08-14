import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { memorialService } from '../services/api';

const UserMemorials = () => {
  const [memorials, setMemorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, public, private, draft
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, views, comments

  useEffect(() => {
    fetchMemorials();
  }, [filter, sortBy]);

  const fetchMemorials = async () => {
    try {
      setLoading(true);
      const response = await memorialService.getMyMemorials({ 
        filter, 
        sortBy,
        includeStats: true 
      });
      setMemorials(response.memorials || []);
    } catch (error) {
      console.error('Error fetching memorials:', error);
      setError('Ошибка при загрузке мемориалов');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (memorialId, newStatus) => {
    try {
      await memorialService.updateStatus(memorialId, newStatus);
      await fetchMemorials(); // Перезагружаем список
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Ошибка при изменении статуса');
    }
  };

  const handleDelete = async (memorialId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот мемориал? Это действие нельзя отменить.')) {
      return;
    }

    try {
      await memorialService.removeMemorial(memorialId);
      await fetchMemorials(); // Перезагружаем список
    } catch (error) {
      console.error('Error deleting memorial:', error);
      setError('Ошибка при удалении мемориала');
    }
  };

  const getStatusBadge = (memorial) => {
    if (!memorial.isPublic) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Черновик</span>;
    }
    if (!memorial.isApproved) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">На модерации</span>;
    }
    return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Опубликован</span>;
  };

  const filteredMemorials = memorials.filter(memorial => {
    switch (filter) {
      case 'public':
        return memorial.isPublic && memorial.isApproved;
      case 'private':
        return !memorial.isPublic;
      case 'pending':
        return memorial.isPublic && !memorial.isApproved;
      default:
        return true;
    }
  });

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
            + Создать мемориал
          </Link>
        </div>

        {/* Фильтры и сортировка */}
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Фильтр:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Все</option>
              <option value="public">Опубликованные</option>
              <option value="private">Черновики</option>
              <option value="pending">На модерации</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Сортировка:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Новые первые</option>
              <option value="oldest">Старые первые</option>
              <option value="views">По просмотрам</option>
              <option value="comments">По комментариям</option>
            </select>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {filteredMemorials.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Нет мемориалов</h3>
            <p className="mt-2 text-gray-500">
              {filter === 'all' 
                ? 'Вы еще не создали ни одного мемориала.' 
                : 'Нет мемориалов с выбранным фильтром.'}
            </p>
            {filter === 'all' && (
              <div className="mt-6">
                <Link
                  to="/create-memorial"
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Создать первый мемориал
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredMemorials.map((memorial) => (
              <div key={memorial._id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {memorial.photo && (
                        <img
                          src={fixImageUrl(memorial.photo)}
                          alt={`${memorial.firstName} ${memorial.lastName}`}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {memorial.firstName} {memorial.lastName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          {getStatusBadge(memorial)}
                          <span className="text-sm text-gray-500">
                            {memorial.birthDate && memorial.deathDate && (
                              `${new Date(memorial.birthDate).getFullYear()} - ${new Date(memorial.deathDate).getFullYear()}`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {memorial.epitaph && (
                      <p className="text-gray-700 text-sm mb-3 italic">"{memorial.epitaph}"</p>
                    )}

                    {/* Статистика */}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {memorial.views || 0} просмотров
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {memorial.commentsCount || 0} комментариев
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(memorial.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex flex-col space-y-2 ml-4">
                    <Link
                      to={memorial.customSlug ? `/${memorial.customSlug}` : `/memorial/${memorial.shareUrl || memorial._id}`}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm hover:bg-blue-200 transition-colors text-center"
                    >
                      Просмотр
                    </Link>
                    
                    {/* Кнопки изменения статуса */}
                    {!memorial.isPublic && (
                      <button
                        onClick={() => handleStatusChange(memorial._id, 'publish')}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-sm hover:bg-green-200 transition-colors"
                      >
                        Опубликовать
                      </button>
                    )}
                    
                    {memorial.isPublic && (
                      <button
                        onClick={() => handleStatusChange(memorial._id, 'unpublish')}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-sm hover:bg-yellow-200 transition-colors"
                      >
                        Снять с публикации
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(memorial._id)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm hover:bg-red-200 transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMemorials;