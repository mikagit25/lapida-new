import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import UserAvatarBlock from '../components/UserAvatarBlock';
import UserBioBlock from '../components/UserBioBlock';
import UserContactsBlock from '../components/UserContactsBlock';
import UserFriendsBlock from '../components/UserFriendsBlock';
import UserGalleryBlock from '../components/UserGalleryBlock';
import UserMemorialsBlock from '../components/UserMemorialsBlock';
import UserStatsBlock from '../components/UserStatsBlock';
import UserPrivacyToggle from '../components/UserPrivacyToggle';

const UserPublicPage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [visibleBlocks, setVisibleBlocks] = useState({
    avatar: true,
    bio: true,
    contacts: false,
    friends: true,
    gallery: true,
    memorials: true,
    stats: true,
  });
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!id || id === 'undefined') {
      setError('Некорректный адрес пользователя. Публичная страница не может быть загружена.');
      setUser(null);
      return;
    }
    fetch(`/api/users/${id}/public`)
      .then(res => res.json())
      .then(data => {
        console.log('User public API response:', data);
        if (data && data.user) {
          // Явно копируем массив мемориалов и выводим в консоль
          const memorialsArr = Array.isArray(data.memorials) ? data.memorials : [];
          console.log('User public memorials:', memorialsArr);
          setUser({
            ...data.user,
            gallery: data.gallery || data.user.gallery || [],
            memorials: memorialsArr,
            stats: data.stats || {},
            friends: data.friends || [],
            memorialsCreated: (data.stats && (data.stats.memorialsCreated ?? data.stats.memorials ?? memorialsArr.length)) || memorialsArr.length || 0,
            flowersLeft: (data.stats && data.stats.flowersLeft) || 0,
            commentsLeft: (data.stats && data.stats.commentsLeft) || 0,
            bio: data.user.bio || data.user.biography || '',
          });
        } else {
          setError(data?.message || 'Пользователь не найден или профиль скрыт.');
          setUser(null);
        }
      })
      .catch(() => {
        setError('Ошибка загрузки публичных данных пользователя.');
        setUser(null);
      });
  }, [id]);

  const handleToggleBlock = (block) => {
    setVisibleBlocks((prev) => ({ ...prev, [block]: !prev[block] }));
  };

  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!user) return <div className="p-8 text-center">Загрузка...</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Личная страница пользователя</h1>
      {isOwner && <UserPrivacyToggle user={user} />}
      <div className="space-y-6">
        {visibleBlocks.avatar && <UserAvatarBlock user={user} onToggle={() => handleToggleBlock('avatar')} isOwner={isOwner} />}
        {visibleBlocks.bio && <UserBioBlock user={user} onToggle={() => handleToggleBlock('bio')} isOwner={isOwner} />}
        {visibleBlocks.contacts && <UserContactsBlock user={user} onToggle={() => handleToggleBlock('contacts')} isOwner={isOwner} />}
        {visibleBlocks.friends && <UserFriendsBlock user={user} onToggle={() => handleToggleBlock('friends')} isOwner={isOwner} />}
        {visibleBlocks.gallery && <UserGalleryBlock user={user} onToggle={() => handleToggleBlock('gallery')} isOwner={isOwner} />}
        {visibleBlocks.memorials && <UserMemorialsBlock user={user} onToggle={() => handleToggleBlock('memorials')} isOwner={isOwner} />}
        {visibleBlocks.stats && <UserStatsBlock user={user} onToggle={() => handleToggleBlock('stats')} isOwner={isOwner} />}
      </div>
    </div>
  );
};

export default UserPublicPage;
