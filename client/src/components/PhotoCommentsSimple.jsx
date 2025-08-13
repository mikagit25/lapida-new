
import React, { useState, useEffect } from 'react';
import { photoCommentSimpleService } from '../services/api';

const PhotoCommentsSimple = ({ memorialId, photoUrl }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (memorialId && photoUrl) {
      loadComments();
    }
  }, [memorialId, photoUrl]);

  const loadComments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await photoCommentSimpleService.getByPhoto(memorialId, photoUrl);
      setComments(data);
    } catch (e) {
      setError(e.message || 'Ошибка загрузки комментариев');
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setLoading(true);
    setError('');
    try {
      await photoCommentSimpleService.add({
        memorialId,
        photoUrl,
        text: newComment.trim(),
        authorName: 'Аноним',
      });
      setNewComment('');
      await loadComments();
    } catch (e) {
      setError(e.message || 'Ошибка добавления комментария');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Комментарии к фото</h3>
      {loading && <div className="text-gray-500">Загрузка...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="space-y-3 mb-4">
        {comments.length === 0 && !loading ? (
          <div className="text-gray-500">Пока нет комментариев</div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-gray-50 rounded p-2">
              <div className="text-sm text-gray-700">{comment.text}</div>
              <div className="text-xs text-gray-400">{comment.authorName || 'Аноним'} • {new Date(comment.createdAt).toLocaleString('ru-RU')}</div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleAddComment} className="flex flex-col space-y-2">
        <textarea
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Ваш комментарий..."
          className="border rounded p-2"
          rows={2}
        />
        <button type="submit" className="bg-blue-500 text-white rounded px-4 py-2" disabled={loading || !newComment.trim()}>
          Добавить комментарий
        </button>
      </form>
    </div>
  );
};

export default PhotoCommentsSimple;
