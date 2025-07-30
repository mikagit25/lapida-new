import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { newMemorialService, commentService } from '../services/api';
import Gallery from '../components/Gallery';
import LifeTimeline from '../components/LifeTimeline';
import ShareBlock from '../components/ShareBlock';
import CommentSection from '../components/CommentSection';
import EditableBiography from '../components/EditableBiography';
import EditableEpitaph from '../components/EditableEpitaph';
import EditableLocation from '../components/EditableLocation';

const MemorialView = () => {
  const { shareUrl, slug } = useParams();
  const location = useLocation();
  const [memorial, setMemorial] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMemorial();
  }, [shareUrl, slug]);

  const loadMemorial = async () => {
    try {
      setLoading(true);
      
      // Определяем тип URL по пути
      const isSlugRoute = location.pathname.startsWith('/memorial/') === false && location.pathname !== '/';
      const isMemorialRoute = location.pathname.startsWith('/memorial/');
      
      let memorialData;
      
      if (isSlugRoute && slug) {
        // Загружаем по красивому URL (slug)
        console.log('MemorialView - loading by slug:', slug);
        memorialData = await newMemorialService.getBySlug(slug);
      } else if (isMemorialRoute && shareUrl) {
        // Загружаем по старому формату (shareUrl)
        console.log('MemorialView - loading by shareUrl:', shareUrl);
        memorialData = await newMemorialService.getByShareUrl(shareUrl);
      } else {
        throw new Error('Неверный формат URL');
      }
      
      setMemorial(memorialData);
      
      // Загружаем все комментарии (без фильтрации по секции)
      const commentsData = await commentService.getByMemorial(memorialData._id);
      // Проверяем, что сервер вернул - объект с comments или массив
      const commentsArray = commentsData.comments || commentsData;
      setComments(Array.isArray(commentsArray) ? commentsArray : []);
    } catch (error) {
      console.error('Error loading memorial:', error);
      setError('Мемориал не найден или недоступен');
    } finally {
      setLoading(false);
    }
  };

  const handleNewComment = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  const handleImagesUpdate = (newImages) => {
    setMemorial(prev => ({
      ...prev,
      galleryImages: newImages
    }));
  };

  const handleProfileImageChange = (newProfileImage) => {
    setMemorial(prev => ({
      ...prev,
      profileImage: newProfileImage
    }));
  };

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
    <div className="min-h-screen bg-gray-50">
      {/* Шапка мемориала */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Портрет */}
            <div className="flex-shrink-0">
              {memorial.profileImage ? (
                <img
                  src={memorial.profileImage}
                  alt={memorial.fullName}
                  className="w-48 h-48 md:w-64 md:h-64 rounded-lg object-cover shadow-lg"
                  onError={(e) => {
                    console.error('Ошибка загрузки изображения:', memorial.profileImage);
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-lg bg-gray-200 flex items-center justify-center shadow-lg">
                  <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Основная информация */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {memorial.fullName}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {memorial.lifespan}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-8">
            {/* Эпитафия */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Эпитафия</h2>
              <EditableEpitaph 
                memorial={memorial} 
                onUpdate={setMemorial}
              />
              
              {/* Комментарии к эпитафии */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Комментарии к эпитафии</h3>
                <CommentSection
                  memorialId={memorial._id}
                  comments={comments.filter(comment => comment.section === 'epitaph')}
                  onNewComment={handleNewComment}
                  section="epitaph"
                />
              </div>
            </div>

            {/* Биография */}
            <EditableBiography 
              memorial={memorial} 
              onUpdate={setMemorial}
            />

            {/* Лента жизни (Timeline) */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <LifeTimeline memorialId={memorial._id} />
            </div>

            {/* Галерея */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Галерея</h2>
              <Gallery 
                memorialId={memorial._id}
                images={memorial.galleryImages || []} 
                onImagesUpdate={handleImagesUpdate}
                canEdit={true}
                currentProfileImage={memorial.profileImage}
                onProfileImageChange={handleProfileImageChange}
              />
            </div>

            {/* Комментарии */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Воспоминания и соболезнования</h2>
              <CommentSection
                memorialId={memorial._id}
                comments={comments.filter(comment => !comment.section || comment.section === 'general')}
                onNewComment={handleNewComment}
                section="general"
              />
            </div>
          </div>

          {/* Боковая панель */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Блок поделиться */}
              <ShareBlock memorial={memorial} />

              {/* Местоположение захоронения */}
              <EditableLocation memorial={memorial} onUpdate={setMemorial} />

              {/* Статистика */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Статистика</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Просмотры</span>
                    <span className="font-semibold">{memorial.views || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Комментарии</span>
                    <span className="font-semibold">{comments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Создан</span>
                    <span className="font-semibold">
                      {new Date(memorial.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Дополнительная информация */}
              {(memorial.birthPlace || memorial.deathPlace) && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Места</h3>
                  <div className="space-y-3">
                    {memorial.birthPlace && (
                      <div>
                        <span className="text-gray-600 block">Место рождения</span>
                        <span className="font-semibold">{memorial.birthPlace}</span>
                      </div>
                    )}
                    {memorial.deathPlace && (
                      <div>
                        <span className="text-gray-600 block">Место смерти</span>
                        <span className="font-semibold">{memorial.deathPlace}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemorialView;
