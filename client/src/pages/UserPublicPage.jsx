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
    // Временный fetch для теста (заменить на реальный API)
    fetch(`/api/users/${id}/public`)
      .then(res => res.json())
      .then(data => {
          // Для отладки: выводим ответ API в консоль
          console.log('User public API response:', data);
          // Объединяем данные из API: user, gallery, memorials
          if (data && data.user) {
              setUser({
                ...data.user,
                gallery: data.gallery || data.user.gallery || [],
                memorials: data.memorials || [],
                stats: data.stats || {},
                friends: data.friends || [],
                // Для статистики
                memorialsCreated: (data.stats && (data.stats.memorialsCreated ?? data.stats.memorials ?? data.memorials?.length)) || data.memorials?.length || 0,
                flowersLeft: (data.stats && data.stats.flowersLeft) || 0,
                commentsLeft: (data.stats && data.stats.commentsLeft) || 0,
                // Для блока "О себе"
                bio: data.user.bio || data.user.biography || '',
              });
          } else {
            setUser({
              name: 'Тестовый пользователь',
              avatar: '',
              bio: 'Тестовая биография',
              email: 'test@example.com',
              phone: '',
              friends: [],
              relatives: [],
              gallery: [],
              memorials: [],
              stats: { memorialsCreated: 0, flowersLeft: 0, commentsLeft: 0 },
              isPublic: true
            });
          }
        // TODO: set isOwner по логике авторизации
      })
      .catch(() => {
        setUser({
          name: 'Тестовый пользователь',
          avatar: '',
          bio: 'Тестовая биография',
          email: 'test@example.com',
          phone: '',
          friends: [],
          relatives: [],
          gallery: [],
          memorials: [],
          stats: { memorialsCreated: 0, flowersLeft: 0, commentsLeft: 0 },
          isPublic: true
        });
      });
  }, [id]);

  const handleToggleBlock = (block) => {
    setVisibleBlocks((prev) => ({ ...prev, [block]: !prev[block] }));
  };

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
