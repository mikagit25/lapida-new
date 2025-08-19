import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { newMemorialService, commentService } from '../services/api';
import Gallery from '../components/Gallery';
import MemorialStats from '../components/MemorialStats';
import MemorialSidebar from '../components/MemorialSidebar';
import LifeTimeline from '../components/LifeTimeline';
import ShareBlock from '../components/ShareBlock';
import CommentSection from '../components/CommentSection';
import CollapsibleComments from '../components/CollapsibleComments';
import EditableBiography from '../components/EditableBiography';
import EditableEpitaph from '../components/EditableEpitaph';
import EditableLocation from '../components/EditableLocation';
import LocationView from '../components/LocationView';
import EpitaphSection from '../components/EpitaphSection';
import VirtualFlowers from '../components/VirtualFlowers';
import VirtualCandles from '../components/VirtualCandles';
import BackgroundImageManager from '../components/BackgroundImageManager';
import HeaderBackgroundManager from '../components/HeaderBackgroundManager';
import { fixImageUrl } from '../utils/imageUrl';

const MemorialView = () => {
  const { shareUrl, slug } = useParams();
  const location = useLocation();
  const [memorial, setMemorial] = useState(null);
  const [comments, setComments] = useState([]);
  const [virtualCandles, setVirtualCandles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMemorial();
  }, [shareUrl, slug]);

  const loadMemorial = async () => {
    try {
      setLoading(true);
      // Определяем тип URL и загружаем соответственно
      const isSlugRoute = location.pathname.startsWith('/memorial/') === false && location.pathname !== '/';
      const isShareUrlRoute = location.pathname.startsWith('/memorial/');
      let memorialData = null;
      let tried = [];
      try {
        if (isSlugRoute && slug) {
          console.log('MemorialView - loading by slug:', slug);
          memorialData = await newMemorialService.getBySlug(slug);
          tried.push('slug');
        } else if (isShareUrlRoute && shareUrl) {
          console.log('MemorialView - loading by shareUrl:', shareUrl);
          memorialData = await newMemorialService.getByShareUrl(shareUrl);
          tried.push('shareUrl');
        } else {
          throw new Error('Неверный формат URL');
        }
      } catch (err) {
        console.warn('Primary memorial load failed:', err);
      }
      // Fallback: если не найден, пробуем альтернативные варианты
      if (!memorialData) {
        if (isShareUrlRoute && shareUrl) {
          // Пробуем как slug
          try {
            memorialData = await newMemorialService.getBySlug(shareUrl);
            tried.push('fallback-slug');
          } catch (err) {
            console.warn('Fallback by slug failed:', err);
          }
        }
        if (!memorialData && (slug || shareUrl)) {
          // Пробуем как _id
          const id = slug || shareUrl;
          try {
            memorialData = await newMemorialService.getById(id);
            tried.push('fallback-id');
          } catch (err) {
            console.warn('Fallback by id failed:', err);
          }
        }
      }
      if (!memorialData) {
        throw new Error('Мемориал не найден');
      }
      setMemorial(memorialData);
      // Загружаем комментарии
      const commentsData = await commentService.getByMemorial(memorialData._id);
      const commentsArray = commentsData.comments || commentsData;
      setComments(Array.isArray(commentsArray) ? commentsArray : []);
    } catch (error) {
      console.error('Error loading memorial:', error);
      setError('Мемориал не найден или недоступен');
    } finally {
      setLoading(false);
    }
  };

  const handleMemorialUpdate = (updateFn) => {
    console.log('MemorialView: handleMemorialUpdate called with:', updateFn);
    if (typeof updateFn === 'function') {
      setMemorial(updateFn);
    } else {
      setMemorial(updateFn);
    }
    // Убираем автоматическую перезагрузку, которая может сбрасывать изменения
    // setTimeout(() => {
    //   console.log('MemorialView: Перезагружаем мемориал через 500ms');
    //   loadMemorial();
    // }, 500);
  };

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

  const handleAddCandle = (candle) => {
    setVirtualCandles(prev => [...prev, candle]);
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
      {/* Background image manager - renders at z-index -1 */}
      <BackgroundImageManager 
        memorial={memorial}
        onUpdate={setMemorial}
        canEdit={true}
      />

      {/* Контент с повышенным z-index */}
      <div className="relative" style={{ zIndex: 1 }}>
        {/* Виртуальные цветы - под именем и датами */}
        <VirtualFlowers 
          memorialId={memorial?._id}
          memorial={memorial}
          canEdit={true}
        />

        {/* Шапка мемориала с возможностью смены фона */}
        <HeaderBackgroundManager 
          memorial={memorial}
          onUpdate={handleMemorialUpdate}
          canEdit={true}
        />

        {/* Виртуальные свечи - кнопка и отображение */}
        <VirtualCandles 
          memorialId={memorial?._id}
          memorial={memorial}
          canEdit={true}
        />

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
                onImagesUpdate={handleImagesUpdate}
                canEdit={true}
                currentProfileImage={memorial.profileImage}
                onProfileImageChange={handleProfileImageChange}
              />
            </div>

            {/* Комментарии - Воспоминания и соболезнования */}
            <CollapsibleComments
              memorialId={memorial._id}
              comments={comments}
              onNewComment={handleNewComment}
            />

            {/* Лента жизни (Timeline) */}
            <LifeTimeline memorialId={memorial._id} />

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
