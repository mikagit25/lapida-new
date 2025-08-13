import React, { useState, useEffect } from 'react';
import { friendsService } from '../services/api';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      setLoading(true);
      const response = await friendsService.getFriends();
      setFriends(response.data || []);
    } catch (err) {
      setError('Ошибка загрузки списка друзей');
      console.error('Error loading friends:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя из друзей?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [friendId]: 'removing' }));
      await friendsService.removeFriend(friendId);
      setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
    } catch (err) {
      setError('Ошибка при удалении друга');
      console.error('Error removing friend:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [friendId]: null }));
    }
  };

  const handleBlockUser = async (friendId) => {
    if (!window.confirm('Вы уверены, что хотите заблокировать этого пользователя?')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [friendId]: 'blocking' }));
      await friendsService.blockUser(friendId);
      setFriends(prevFriends => prevFriends.filter(friend => friend.id !== friendId));
    } catch (err) {
      setError('Ошибка при блокировке пользователя');
      console.error('Error blocking user:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [friendId]: null }));
    }
  };

  const handleViewProfile = (friendId) => {
    // Здесь можно добавить навигацию к профилю пользователя
    console.log('Viewing profile of user:', friendId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Загрузка друзей...</span>
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
          onClick={loadFriends}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        <p className="text-gray-500 text-lg">У вас пока нет друзей</p>
        <p className="text-gray-400 text-sm mt-1">Найдите пользователей и добавьте их в друзья</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Мои друзья ({friends.length})
        </h3>
        <button 
          onClick={loadFriends}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Обновить
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {friends.map((friend) => (
          <div key={friend.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                {friend.avatar ? (
                  <img 
                    src={fixImageUrl(friend.avatar)} 
                    alt={friend.name}
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
                  {friend.name || friend.username}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  @{friend.username}
                </p>
                {friend.lastActive && (
                  <p className="text-xs text-gray-400">
                    Последний раз: {new Date(friend.lastActive).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 flex space-x-2">
              <button
                onClick={() => handleViewProfile(friend.id)}
                className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Профиль
              </button>
              
              <button
                onClick={() => handleRemoveFriend(friend.id)}
                disabled={actionLoading[friend.id] === 'removing'}
                className="bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {actionLoading[friend.id] === 'removing' ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-600 mr-1"></div>
                    <span>Удаление...</span>
                  </div>
                ) : (
                  'Удалить'
                )}
              </button>
              
              <button
                onClick={() => handleBlockUser(friend.id)}
                disabled={actionLoading[friend.id] === 'blocking'}
                className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
              >
                {actionLoading[friend.id] === 'blocking' ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                    <span>Блокировка...</span>
                  </div>
                ) : (
                  'Заблокировать'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;