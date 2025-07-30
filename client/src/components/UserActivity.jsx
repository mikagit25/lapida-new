import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/api';

const UserActivity = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0
  });

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async (page = 1) => {
    try {
      setLoading(true);
      const response = await userService.getMyComments({ page, limit: 10 });
      setComments(response.comments || []);
      setPagination(response.pagination || { current: 1, total: 1, count: 0 });
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Ошибка при загрузке активности');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchComments(page);
  };

  const getCommentTypeText = (comment) => {
    if (comment.isFlower) return 'Цветы';
    if (comment.type === 'photo') return 'Комментарий к фото';
    return 'Комментарий';
  };

  const getCommentTypeColor = (comment) => {
    if (comment.isFlower) return 'bg-pink-100 text-pink-800';
    if (comment.type === 'photo') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Моя активность</h2>
        </div>
        <div className="px-6 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка активности...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Моя активность</h2>
        <p className="text-sm text-gray-600">Ваши комментарии и оставленные цветы</p>
      </div>

      <div className="px-6 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Нет активности</h3>
            <p className="mt-2 text-gray-500">Вы еще не оставляли комментариев или цветов.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCommentTypeColor(comment)}`}>
                          {getCommentTypeText(comment)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString('ru-RU', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {comment.memorial && (
                        <div className="mb-2">
                          <Link
                            to={comment.memorial.customSlug ? `/${comment.memorial.customSlug}` : `/memorial/${comment.memorial._id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {comment.memorial.firstName} {comment.memorial.lastName}
                          </Link>
                        </div>
                      )}

                      <div className="text-gray-700">
                        {comment.isFlower ? (
                          <span className="text-pink-600 font-medium">🌸 Оставлены цветы в память</span>
                        ) : (
                          <p className="whitespace-pre-wrap">{comment.text}</p>
                        )}
                      </div>

                      {comment.photo && (
                        <div className="mt-2">
                          <img
                            src={comment.photo}
                            alt="Фото к комментарию"
                            className="w-32 h-32 object-cover rounded-md border border-gray-200"
                          />
                        </div>
                      )}

                      {comment.section && comment.section !== 'general' && (
                        <div className="mt-2 text-sm text-gray-500">
                          Раздел: {
                            comment.section === 'epitaph' ? 'Эпитафия' :
                            comment.section === 'biography' ? 'Биография' :
                            comment.section === 'photo' ? 'Фото' :
                            comment.section
                          }
                        </div>
                      )}
                    </div>

                    {comment.memorial?.photo && (
                      <div className="ml-4 flex-shrink-0">
                        <img
                          src={comment.memorial.photo}
                          alt={`${comment.memorial.firstName} ${comment.memorial.lastName}`}
                          className="w-16 h-16 object-cover rounded-md border border-gray-200"
                        />
                      </div>
                    )}
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

export default UserActivity;
