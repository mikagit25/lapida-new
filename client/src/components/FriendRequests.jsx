import React, { useState, useEffect } from 'react';
import { friendsService } from '../services/api';
import { fixImageUrl } from '../utils/imageUrl';

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState('received'); // received, sent

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await friendsService.getFriendRequests();
      setRequests(response.data || []);
    } catch (err) {
      setError('Ошибка загрузки заявок в друзья');
      console.error('Error loading friend requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'accepting' }));
      await friendsService.acceptFriendRequest(requestId);
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
    } catch (err) {
      setError('Ошибка при принятии заявки');
      console.error('Error accepting friend request:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'rejecting' }));
      await friendsService.rejectFriendRequest(requestId);
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
    } catch (err) {
      setError('Ошибка при отклонении заявки');
      console.error('Error rejecting friend request:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Вы уверены, что хотите отменить заявку?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [requestId]: 'canceling' }));
      await friendsService.rejectFriendRequest(requestId);
      setRequests(prevRequests => 
        prevRequests.filter(request => request.id !== requestId)
      );
    } catch (err) {
      setError('Ошибка при отмене заявки');
      console.error('Error canceling friend request:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [requestId]: null }));
    }
  };

  const handleViewProfile = (userId) => {
    // Здесь можно добавить навигацию к профилю пользователя
    console.log('Viewing profile of user:', userId);
  };

  const getFilteredRequests = () => {
    return requests.filter(request => {
      if (activeTab === 'received') {
        return request.type === 'received';
      } else {
        return request.type === 'sent';
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Загрузка заявок...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-red-700">{error}</span>
        </div>
        <button 
          onClick={loadRequests}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  const filteredRequests = getFilteredRequests();

  return (
    <div className="space-y-4">
      {/* Заголовок и обновление */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Заявки в друзья
        </h3>
        <button 
          onClick={loadRequests}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Обновить
        </button>
      </div>

      {/* Табы */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('received')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Входящие ({requests.filter(r => r.type === 'received').length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Исходящие ({requests.filter(r => r.type === 'sent').length})
          </button>
        </nav>
      </div>

      {/* Список заявок */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500 text-lg">
            {activeTab === 'received' ? 'Нет входящих заявок' : 'Нет исходящих заявок'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {activeTab === 'received' 
              ? 'Новые заявки в друзья появятся здесь'
              : 'Ваши отправленные заявки появятся здесь'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex-shrink-0">
                    {request.user?.avatar ? (
                      <img 
                        src={fixImageUrl(request.user.avatar)} 
                        alt={request.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {request.user?.name || request.user?.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      @{request.user?.username}
                    </p>
                    {request.createdAt && (
                      <p className="text-xs text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleViewProfile(request.user?.id)}
                    className="bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Профиль
                  </button>

                  {activeTab === 'received' ? (
                    <>
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        disabled={actionLoading[request.id] === 'accepting'}
                        className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {actionLoading[request.id] === 'accepting' ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                            <span>Принятие...</span>
                          </div>
                        ) : (
                          'Принять'
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={actionLoading[request.id] === 'rejecting'}
                        className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {actionLoading[request.id] === 'rejecting' ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                            <span>Отклонение...</span>
                          </div>
                        ) : (
                          'Отклонить'
                        )}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleCancelRequest(request.id)}
                      disabled={actionLoading[request.id] === 'canceling'}
                      className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                    >
                      {actionLoading[request.id] === 'canceling' ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                          <span>Отмена...</span>
                        </div>
                      ) : (
                        'Отменить'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;