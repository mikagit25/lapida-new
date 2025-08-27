import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fixImageUrl } from '../utils/imageUrl';

const UserCard = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center bg-white rounded shadow p-4 mb-4">
      <div className="flex-shrink-0 w-14 h-14">
        {user.avatar ? (
          <img src={fixImageUrl(user.avatar)} alt={user.name} className="w-14 h-14 rounded-full object-cover" />
        ) : (
          <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        )}
      </div>
      <div className="ml-4 flex-1 min-w-0">
        <div className="text-lg font-semibold text-gray-900">{user.name}</div>
        {user.email && <div className="text-sm text-gray-500">{user.email}</div>}
        {user.location && <div className="text-xs text-gray-400">📍 {user.location}</div>}
      </div>
      <button
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => navigate(`/user/${user.id}`)}
      >
        Открыть страницу
      </button>
    </div>
  );
};

export default UserCard;
