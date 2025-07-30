import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PhotoComments = ({ memorialId, photoUrl, isVisible, onClose }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth();

  // Отладочное логирование
  console.log('PhotoComments props:', {
    memorialId,
    photoUrl,
    isVisible,
    isAuthenticated,
    user
  });

  useEffect(() => {
    if (isVisible && photoUrl) {
      console.log('Loading comments for:', { memorialId, photoUrl });
      loadComments();
    }
  }, [isVisible, photoUrl, memorialId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5002/api/photo-comments/memorial/${memorialId}/photo?photoUrl=${encodeURIComponent(photoUrl)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        setError('Ошибка загрузки комментариев');
      }
    } catch (error) {
      console.error('Ошибка загрузки комментариев:', error);
      setError('Ошибка загрузки комментариев');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    try {
      const token = localStorage.getItem('authToken');
      console.log('Отправка комментария:', {
        memorialId,
        photoUrl,
        text: newComment.trim(),
        hasToken: !!token
      });
      
      const response = await fetch(`http://localhost:5002/api/photo-comments/memorial/${memorialId}/photo/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          photoUrl,
          text: newComment.trim()
        })
      });

      console.log('Ответ сервера:', response.status, response.statusText);
      
      if (response.ok) {
        const newCommentData = await response.json();
        console.log('Новый комментарий:', newCommentData);
        setComments(prev => [...prev, newCommentData]);
        setNewComment('');
      } else {
        const errorData = await response.text();
        console.error('Ошибка ответа сервера:', errorData);
        setError('Ошибка добавления комментария');
      }
    } catch (error) {
      console.error('Ошибка добавления комментария:', error);
      setError('Ошибка добавления комментария');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Удалить комментарий?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5002/api/photo-comments/comment/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setComments(prev => prev.filter(comment => comment._id !== commentId));
      } else {
        setError('Ошибка удаления комментария');
      }
    } catch (error) {
      console.error('Ошибка удаления комментария:', error);
      setError('Ошибка удаления комментария');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Заголовок */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Комментарии к фотографии
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Контент */}
        <div className="flex flex-col h-[60vh]">
          {/* Список комментариев */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Загрузка комментариев...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Пока нет комментариев к этой фотографии</p>
                <p className="text-sm mt-1">Будьте первым, кто поделится воспоминанием!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {comment.authorName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    {(user?.id === comment.author || user?.id === memorialId) && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Форма добавления комментария */}
          {isAuthenticated && (
            <div className="border-t p-4">
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Поделитесь своими воспоминаниями об этой фотографии..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  maxLength="1000"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {newComment.length}/1000
                  </span>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Добавить комментарий
                  </button>
                </div>
              </form>
            </div>
          )}

          {!isAuthenticated && (
            <div className="border-t p-4 text-center text-gray-500">
              <p>Войдите в систему, чтобы оставлять комментарии</p>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-t">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoComments;
