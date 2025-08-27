import React from 'react';
import UserCard from './UserCard';

const UsersCatalogBlock = ({ users, loading, error }) => {
  if (loading) {
    return <div className="text-gray-500 text-center">Загрузка пользователей...</div>;
  }
  if (error) {
    return <div className="text-red-600 text-center">{error}</div>;
  }
  if (!users || users.length === 0) {
    return <div className="text-gray-500 text-center">Нет зарегистрированных пользователей</div>;
  }
  return (
    <div className="mt-8">
      {users.map(user => <UserCard key={user._id || user.id} user={user} />)}
    </div>
  );
};

export default UsersCatalogBlock;
