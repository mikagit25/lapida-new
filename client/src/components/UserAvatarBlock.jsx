import React from 'react';
import { useTranslation } from 'react-i18next';

const UserAvatarBlock = ({ user, onToggle, isOwner }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded shadow p-4 flex items-center gap-4">
      <img src={user.avatar || '/default-avatar.png'} alt={t('avatar')} className="w-20 h-20 rounded-full object-cover border" />
      <div>
        <div className="font-bold text-lg">{user.name || t('user')}</div>
        {(user.firstName || user.lastName) && (
          <div className="text-gray-700 text-base">{user.firstName} {user.lastName}</div>
        )}
        {isOwner && <button className="ml-2 text-xs text-blue-600 underline" onClick={onToggle}>{t('hide_block')}</button>}
      </div>
    </div>
  );
};

export default UserAvatarBlock;
