import React, { useState, useEffect } from 'react';
import { commentService } from '../services/api';

const EpitaphSection = ({ memorial, onUpdate, canEdit = false }) => {
  const [epitaphComments, setEpitaphComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEpitaphComments();
  }, [memorial._id]);

  const loadEpitaphComments = async () => {
    try {
      setLoading(true);
      console.log('Загружаю комментарии для мемориала:', memorial._id);
      // Передаем type: 'epitaph' чтобы сервер вернул только нужные комментарии
      const response = await commentService.getByMemorial(memorial._id, { type: 'epitaph' });
      console.log('Ответ от сервера:', response);
      const comments = response.comments || response;
      setEpitaphComments(Array.isArray(comments) ? comments : []);
    } catch (error) {
      console.error('Ошибка загрузки комментариев к эпитафии:', error);
      setEpitaphComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      const commentData = {
        memorial: memorial._id, // Используем memorial вместо memorialId
        text: newComment.trim(),
        type: 'epitaph', // Специальный тип для комментариев эпитафии
        authorName: 'Анонимный посетитель' // Используем authorName вместо author
      };

      console.log('Отправляю комментарий:', commentData);
      const addedComment = await commentService.create(commentData);
      console.log('Комментарий создан:', addedComment);
      
      // Обновляем список комментариев
      setEpitaphComments(prev => [addedComment, ...prev]);
      setNewComment('');
      setIsAddingComment(false);
      
      // Принудительно обновляем компонент
      loadEpitaphComments();
    } catch (error) {
      console.error('Ошибка добавления комментария:', error);
      console.error('Полная ошибка:', error.response || error);
      alert('Ошибка при добавлении комментария. Попробуйте еще раз.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Эпитафия</h2>
        <div 
          className="flex items-center space-x-2 text-gray-600 cursor-pointer hover:text-gray-800 transition-colors"
          onClick={() => setShowComments(!showComments)}
        >
          <span className="text-sm font-medium">
            Комментарии
          </span>
          {epitaphComments.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {epitaphComments.length}
            </span>
          )}
          <span className="text-sm">
            {showComments ? 'Скрыть' : 'Показать'}
          </span>
          <svg 
            className={`w-4 h-4 transform transition-transform ${showComments ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Текст эпитафии */}
      <div className="prose max-w-none mb-6">
        {memorial.epitaph ? (
          <blockquote className="text-lg italic text-gray-700 border-l-4 border-blue-500 pl-4 py-2">
            "{memorial.epitaph}"
          </blockquote>
        ) : (
          canEdit && (
            <div className="text-gray-500 italic">
              Нажмите, чтобы добавить эпитафию...
            </div>
          )
        )}
      </div>

      {/* Краткая информация в свернутом состоянии */}
      {!showComments && epitaphComments.length > 0 && (
        <div className="text-sm text-gray-600 mb-4">
          <p>
            {epitaphComments.length === 1 
              ? 'Один комментарий к эпитафии' 
              : `${epitaphComments.length} комментариев к эпитафии`
            }. Нажмите "Показать", чтобы прочитать.
          </p>
        </div>
      )}

      {!showComments && epitaphComments.length === 0 && (
        <div className="text-sm text-gray-500 mb-4">
          <p>Поделитесь своими мыслями об эпитафии</p>
        </div>
      )}

      {/* Раскрывающийся блок комментариев */}
      {showComments && (
        <div className="border-t pt-6 space-y-4">
          {/* Кнопка добавления комментария */}
          {canEdit && !isAddingComment && (
            <button
              onClick={() => setIsAddingComment(true)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Добавить комментарий к эпитафии</span>
            </button>
          )}

          {/* Форма добавления комментария */}
          {isAddingComment && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleAddComment(e);
                  }
                }}
                placeholder="Напишите ваш комментарий к эпитафии..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={loading || !newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Отправка...' : 'Отправить'}
                </button>
                <button
                  onClick={() => {
                    setIsAddingComment(false);
                    setNewComment('');
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {/* Список комментариев */}
          {loading && epitaphComments.length === 0 && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Загрузка комментариев...</p>
            </div>
          )}

          {epitaphComments.length === 0 && !loading ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z" />
              </svg>
              <p>Пока нет комментариев к эпитафии</p>
              <p className="text-sm mt-1">Станьте первым, кто оставит свои воспоминания</p>
            </div>
          ) : (
            <div className="space-y-4">
              {epitaphComments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {(() => {
                            const name = comment.authorName || (comment.author?.name || comment.author) || 'А';
                            return typeof name === 'string' ? name.charAt(0).toUpperCase() : 'А';
                          })()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {comment.authorName || comment.author?.name || comment.author || 'Анонимный посетитель'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EpitaphSection;
