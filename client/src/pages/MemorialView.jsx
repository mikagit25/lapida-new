import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { newMemorialService, commentService } from '../services/api';
import Gallery from '../components/Gallery';
import MemorialStats from '../components/MemorialStats';
import MemorialSidebar from '../components/MemorialSidebar';
import LifeTimeline from '../components/LifeTimeline';
import ShareBlock from '../components/ShareBlock';
import CollapsibleComments from '../components/CollapsibleComments';
import EditableBiography from '../components/EditableBiography';
import EditableEpitaph from '../components/EditableEpitaph';
import EditableLocation from '../components/EditableLocation';
import LocationView from '../components/LocationView';
import EpitaphSection from '../components/EpitaphSection';
import VirtualFlowers from '../components/VirtualFlowers';
import VirtualCandles from '../components/VirtualCandles';
import GiftFab from '../components/GiftFab';
import PrayerFab from '../components/PrayerFab';
import DoveFab from '../components/DoveFab';
import NoteFab from '../components/NoteFab';
import BackgroundImageManager from '../components/BackgroundImageManager';
import AvatarBackgroundManager from '../components/AvatarBackgroundManager';
import MemorialEditorsManager from '../components/MemorialEditorsManager';
import VirtualItemsOnAvatar from '../components/VirtualItemsOnAvatar';
import { virtualItemsService } from '../services/virtualItems';

const MemorialView = () => {
  const { shareUrl, slug } = useParams();
  const [memorial, setMemorial] = useState(null);
  const [comments, setComments] = useState([]);
  const [virtualGifts, setVirtualGifts] = useState([]);
  const [virtualPrayers, setVirtualPrayers] = useState([]);
  const [virtualNotes, setVirtualNotes] = useState([]);
  const [virtualDoves, setVirtualDoves] = useState([]);
  // Загружаем новые виртуальные предметы для аватара
  // Универсальная функция загрузки всех виртуальных предметов
  const loadAllVirtualItems = useCallback(async (memId) => {
    const id = memId || memorial?._id;
    if (!id) return;
    setVirtualGifts(await virtualItemsService.getItems('gift', id));
    setVirtualPrayers(await virtualItemsService.getItems('prayer', id));
    setVirtualNotes(await virtualItemsService.getItems('note', id));
    setVirtualDoves(await virtualItemsService.getItems('dove', id));
  }, [memorial?._id]);

  useEffect(() => {
    loadAllVirtualItems();
  }, [loadAllVirtualItems]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMemorial = useCallback(async () => {
    try {
      setLoading(true);
      let memorialData = null;
      let tried = [];
      // Всегда пробуем по shareUrl, потом по slug, потом по _id
      if (shareUrl) {
        try {
          console.log('MemorialView - loading by shareUrl:', shareUrl);
          memorialData = await newMemorialService.getByShareUrl(shareUrl);
          tried.push('shareUrl');
        } catch (err) {
          console.warn('Primary memorial load by shareUrl failed:', err);
        }
      }
      if (!memorialData && slug) {
        try {
          console.log('MemorialView - loading by slug:', slug);
          memorialData = await newMemorialService.getBySlug(slug);
          tried.push('slug');
        } catch (err) {
          console.warn('Primary memorial load by slug failed:', err);
        }
      }
      if (!memorialData && (slug || shareUrl)) {
        const id = slug || shareUrl;
        try {
          memorialData = await newMemorialService.getById(id);
          tried.push('fallback-id');
        } catch (err) {
          console.warn('Fallback by id failed:', err);
        }
      }
      if (!memorialData) {
        throw new Error('Мемориал не найден');
      }
      const normalizedMemorial = memorialData?.memorial || memorialData?.data || memorialData;
      setMemorial(normalizedMemorial);
      // Загружаем комментарии
      try {
        const commentsData = await commentService.getByMemorial(normalizedMemorial?._id);
        const commentsArray = commentsData.comments || commentsData;
        setComments(Array.isArray(commentsArray) ? commentsArray : []);
      } catch (commentsError) {
        if (commentsError?.response?.status === 404) {
          setComments([]); // Нет комментариев — не ошибка
        } else {
          console.error('Ошибка загрузки комментариев:', commentsError);
        }
      }
    } catch (error) {
      console.error('Error loading memorial:', error);
      setError('Мемориал не найден или недоступен');
    } finally {
      setLoading(false);
    }
  }, [shareUrl, slug]);

  useEffect(() => {
    loadMemorial();
  }, [loadMemorial]);

  // Безопасная функция обновления для EditableLocation
  const handleLocationUpdate = (updatedMemorialOrFn) => {
    console.log('MemorialView: handleLocationUpdate called with:', updatedMemorialOrFn);
    console.log('MemorialView: handleLocationUpdate type:', typeof updatedMemorialOrFn);
    
    if (typeof updatedMemorialOrFn === 'function') {
      // Если передана функция обновления
      console.log('MemorialView: Применяем функцию обновления');
      setMemorial(prev => {
        const updated = updatedMemorialOrFn(prev);
        console.log('MemorialView: Обновленное состояние мемориала, фото захоронения:', updated.location?.gravePhotos?.length);
        return updated;
      });
    } else {
      // Если передан объект мемориала
      const updatedMemorial = updatedMemorialOrFn;
      console.log('MemorialView: Применяем объект мемориала:', updatedMemorial?._id);
      console.log('MemorialView: Новое количество фото захоронения:', updatedMemorial?.location?.gravePhotos?.length);
      
      // Проверяем, что shareUrl не изменился
      if (updatedMemorial && updatedMemorial.shareUrl === memorial?.shareUrl) {
        console.log('MemorialView: shareUrl совпадает, обновляем полностью');
        setMemorial(updatedMemorial);
      } else {
        console.warn('MemorialView: shareUrl изменился, используем частичное обновление');
        console.log('Old shareUrl:', memorial?.shareUrl, 'New shareUrl:', updatedMemorial?.shareUrl);
        // Частичное обновление без изменения критичных полей
        setMemorial(prev => ({
          ...prev,
          ...updatedMemorial,
          shareUrl: prev.shareUrl, // Сохраняем оригинальный shareUrl
          _id: prev._id // Сохраняем оригинальный ID
        }));
      }
    }
    
    console.log('MemorialView: handleLocationUpdate завершен');
  };

  const handleNewComment = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleImagesUpdate = async (newImages) => {
    console.log('MemorialView: handleImagesUpdate called with:', newImages?.length, 'images');
    // Локально обновляем для мгновенного UX
    setMemorial(prev => {
      const updated = {
        ...prev,
        galleryImages: newImages
      };
      console.log('MemorialView: Memorial updated with new gallery images:', updated.galleryImages?.length);
      return updated;
    });
    // После любого изменения галереи — повторно загружаем мемориал с сервера
    await loadMemorial();
  };

  const handleProfileImageChange = (newProfileImage) => {
    setMemorial(prev => ({
      ...prev,
      profileImage: newProfileImage
    }));
  };

  // Background is now handled by BackgroundImageManager component

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка мемориала...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ошибка</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!memorial) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Мемориал не найден</h1>
          <p className="text-gray-600">Возможно, ссылка неверна или мемориал был удален.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* Аватар и контейнер для свечей/цветов */}
      <AvatarBackgroundManager 
        memorial={memorial}
        onUpdate={setMemorial}
      />
      {/* Фон мемориала */}
      <BackgroundImageManager 
        memorial={memorial}
        onUpdate={setMemorial}
        canEdit={true}
      />
      {/* Контент с повышенным z-index */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Виртуальные цветы - под именем и датами */}
        {/* FAB-кнопки для всех виртуальных предметов в одну линию справа внизу */}
        <div className="fixed bottom-6 right-6 z-30 flex flex-row items-end gap-4">
          <VirtualCandles memorialId={memorial?._id} memorial={memorial} canEdit={true} />
          <VirtualFlowers memorialId={memorial?._id} memorial={memorial} canEdit={true} />
    <GiftFab memorialId={memorial?._id} onGiftAdded={() => loadAllVirtualItems()} />
    <PrayerFab memorialId={memorial?._id} onPrayerAdded={() => loadAllVirtualItems()} />
    <DoveFab memorialId={memorial?._id} onDoveAdded={() => loadAllVirtualItems()} />
    <NoteFab memorialId={memorial?._id} onNoteAdded={() => loadAllVirtualItems()} />
        </div>
        {/* Новые виртуальные предметы на аватаре */}
        <VirtualItemsOnAvatar items={virtualGifts} iconFallback="🎁" type="gift" side="right" />
        <VirtualItemsOnAvatar items={virtualPrayers} iconFallback="🙏" type="prayer" side="right" />
        <VirtualItemsOnAvatar items={virtualNotes} iconFallback="📝" type="note" side="right" />
        <VirtualItemsOnAvatar items={virtualDoves} iconFallback="🕊️" type="dove" side="right" />
  {/* Удалены горизонтальные блоки VirtualItemBlock для gifts, prayers, notes, doves */}


      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-8">
            {/* Эпитафия с комментариями */}
            <EpitaphSection 
              memorial={memorial} 
              onUpdate={setMemorial}
              canEdit={true}
            />

            {/* Биография */}
            <EditableBiography 
              memorial={memorial} 
              onUpdate={setMemorial}
            />

            {/* Галерея - Фото и воспоминания */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Фото и воспоминания</h2>
              <Gallery 
                memorialId={memorial._id}
                images={memorial.galleryImages || []}
                currentProfileImage={memorial.profileImage}
                onProfileImageChange={handleProfileImageChange}
                canEdit={true}
                onImagesUpdate={handleImagesUpdate}
              />
            </div>

            {/* Комментарии - Воспоминания и соболезнования */}
            {/* Таймлайн жизни (новый компонент на MUI) */}
            <LifeTimeline memorialId={memorial._id} />
            <CollapsibleComments
              memorialId={memorial._id}
              comments={comments}
              onNewComment={handleNewComment}
            />

            {/* Местоположение захоронения */}
            {/* Место захоронения: редактирование только для владельца/редактора */}
            {(() => {
              // Проверка прав на редактирование
              const user = JSON.parse(localStorage.getItem('user'));
              const createdBy = memorial.createdBy?._id || memorial.createdBy || '';
              const editors = memorial.editorsUsers || [];
              const canEdit = user && (
                user.id === createdBy || user._id === createdBy ||
                editors.includes(user.id) || editors.includes(user._id)
              );
              if (canEdit) {
                return <EditableLocation memorial={memorial} onUpdate={handleLocationUpdate} />;
              }
              return <LocationView memorial={memorial} />;
            })()}

            {/* Блок поделиться */}
            <ShareBlock memorial={memorial} />

            {/* Статистика */}

            {/* Делегирование прав редактирования мемориала */}
            {memorial && memorial._id && (
              <MemorialEditorsManager memorialId={memorial._id} />
            )}

            <MemorialStats memorial={memorial} comments={comments} />

          </div>

          {/* Боковая панель */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <MemorialSidebar memorial={memorial} />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MemorialView;
