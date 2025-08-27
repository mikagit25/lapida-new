import React, { useState, useEffect } from 'react';
import LikeButton from '../components/LikeButton';
import CommentBox from '../components/CommentBox';
import CommentList from '../components/CommentList';

const SocialPage = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetchSocial();
  }, []);

  const fetchSocial = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/social');
      const data = await res.json();
      setComments(data.comments || []);
      setLikes(data.likes || 0);
      setError('');
    } catch (e) {
      setError('Ошибка загрузки данных');
      setComments([]);
      setLikes(0);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (text) => {
    setLoading(true);
    try {
      const res = await fetch('/api/social/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) fetchSocial();
    } catch (e) {
      setError('Ошибка отправки комментария');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/social/like', { method: 'POST' });
      if (res.ok) fetchSocial();
    } catch (e) {
      setError('Ошибка лайка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Социальные функции</h1>
      <LikeButton initialCount={likes} onLike={handleLike} />
      <CommentBox onSubmit={handleComment} />
      {loading && <div>Загрузка...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <CommentList comments={comments} />
    </div>
  );
};

export default SocialPage;
