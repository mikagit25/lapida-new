import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentService } from '../services/api';

const CommentSection = ({ memorialId, comments, onNewComment }) => {
  const { isAuthenticated, user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      const commentData = {
        memorial: memorialId,
        text: newComment,
        authorName: isAuthenticated ? null : (authorName || 'Аноним')
      };

      const createdComment = await commentService.create(commentData);
      onNewComment(createdComment);
      setNewComment('');
      setAuthorName('');
      setShowForm(false);
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAuthorName = (comment) => {
    if (comment.author && typeof comment.author === 'object' && comment.author.name) {
      return comment.author.name;
    }
    return comment.authorName || 'Аноним';
  };

  const getAuthorInitial = (comment) => {
    const name = getAuthorName(comment);
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Форма добавления комментария */}
      <div className="border-t pt-6">
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Оставить воспоминание
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isAuthenticated && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ваше имя (необязательно)
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Как вас зовут?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ваше воспоминание или соболезнование
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Поделитесь воспоминанием или выразите соболезнования..."
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !newComment.trim()}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Отправка...' : 'Отправить'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setNewComment('');
                  setAuthorName('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Список комментариев */}
      <div className="space-y-4">
        {(!comments || comments.length === 0) ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Пока нет воспоминаний. Будьте первым, кто поделится.</p>
          </div>
        ) : (
          Array.isArray(comments) && comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                    <span className="text-gray-600 text-sm font-medium">
                      {getAuthorInitial(comment)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {getAuthorName(comment)}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
                
                {comment.isApproved === false && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    На модерации
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {comment.text}
              </p>

              {comment.photo && (
                <div className="mt-3">
                  <img
                    src={comment.photo}
                    alt="Прикрепленное фото"
                    className="rounded-lg max-w-full h-auto"
                    style={{ maxHeight: '200px' }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Информация о модерации */}
      {comments.some(comment => comment.isApproved === false) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-blue-800">О модерации</h4>
              <p className="text-sm text-blue-700 mt-1">
                Все комментарии проходят модерацию перед публикацией. 
                Это помогает поддерживать уважительную атмосферу в мемориале.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
