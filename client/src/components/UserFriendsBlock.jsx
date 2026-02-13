
import React, { useState } from 'react';
import { getApi } from '../services/api';

const UserFriendsBlock = ({ user, onToggle, isOwner }) => {
  const [addingFriend, setAddingFriend] = useState(false);
  const [addingRelative, setAddingRelative] = useState(false);
  const [addedFriend, setAddedFriend] = useState(false);
  const [addedRelative, setAddedRelative] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(null); // 'friend' | 'relative' | null

  const isAlreadyFriend = Array.isArray(user.friends) && user.friends.some(f => f._id === user._id);
  const isAlreadyRelative = Array.isArray(user.relatives) && user.relatives.some(r => r._id === user._id);

  const handleAddFriend = async () => {
  setShowConfirm('friend');
  };

  const handleAddRelative = async () => {
  setShowConfirm('relative');
  };

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="font-semibold mb-2">Друзья и родственники</div>
      <div>{Array.isArray(user.friends) && user.friends.length > 0 ? user.friends.map(f => f.name || f.email).join(', ') : 'Нет друзей'}</div>
      <div>{Array.isArray(user.relatives) && user.relatives.length > 0 ? 'Родственники: ' + user.relatives.map(r => r.name || r.email).join(', ') : ''}</div>
      {error && <div className="text-red-600 text-xs mt-2">{error}</div>}
      {!isOwner && (
        <div className="mt-4 flex space-x-2">
          <button
            onClick={handleAddFriend}
            disabled={addingFriend || addedFriend || isAlreadyFriend}
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded text-sm font-medium disabled:opacity-50"
          >
            {addedFriend ? 'Уже в друзьях' : addingFriend ? 'Добавление...' : 'Добавить в друзья'}
          </button>
          <button
            onClick={handleAddRelative}
            disabled={addingRelative || addedRelative || isAlreadyRelative}
            className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded text-sm font-medium disabled:opacity-50"
          >
            {addedRelative ? 'Уже в родственниках' : addingRelative ? 'Добавление...' : 'Добавить в родственники'}
          </button>
        </div>
      )}

      {/* Модальное окно подтверждения */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-80 text-center">
            <div className="mb-4 text-lg font-semibold">
              {showConfirm === 'friend' ? 'Добавить этого пользователя в друзья?' : 'Добавить этого пользователя в родственники?'}
            </div>
            <div className="flex space-x-4 justify-center">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={async () => {
                  if (showConfirm === 'friend') {
                    setAddingFriend(true);
                    setError('');
                    try {
                      const api = await getApi();
                      await api.post(`/user-connections/friends/${user._id}`);
                      setAddedFriend(true);
                    } catch (err) {
                      console.error('Ошибка при добавлении в друзья', err);
                      setError('Ошибка при добавлении в друзья');
                    } finally {
                      setAddingFriend(false);
                      setShowConfirm(null);
                    }
                  } else if (showConfirm === 'relative') {
                    setAddingRelative(true);
                    setError('');
                    try {
                      const api = await getApi();
                      await api.post(`/user-connections/relatives/${user._id}`);
                      setAddedRelative(true);
                    } catch (err) {
                      console.error('Ошибка при добавлении в родственники', err);
                      setError('Ошибка при добавлении в родственники');
                    } finally {
                      setAddingRelative(false);
                      setShowConfirm(null);
                    }
                  }
                }}
              >
                Да, добавить
              </button>
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                onClick={() => setShowConfirm(null)}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
      {isOwner && <button className="mt-2 text-xs text-blue-600 underline" onClick={onToggle}>Скрыть блок</button>}
    </div>
  );
};

export default UserFriendsBlock;
