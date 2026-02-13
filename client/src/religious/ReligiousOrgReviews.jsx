// Отзывы о религиозной организации, услугах и товарах
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import religiousReviewService from '../services/religiousReviewService';
import ReviewForm from './ReviewForm';
import ReviewListItem from './ReviewListItem';

const initialReview = {
  author: '',
  rating: 5,
  text: '',
  date: '',
};


const ReligiousOrgReviews = ({ orgId, isOwner }) => {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState(initialReview);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загрузка отзывов при монтировании
  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    religiousReviewService.getByOrganization(orgId)
      .then(setReviews)
      .catch((err) => {
        console.error('Ошибка загрузки отзывов релорганизации:', err);
        setError(t('religiousOrgReviews.loadError'));
      })
      .finally(() => setLoading(false));
  }, [orgId, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let newReview;
      if (editIndex !== null) {
        // Редактирование отзыва не реализовано на backend, только локально
        const updated = [...reviews];
        updated[editIndex] = { ...form, date: form.date || new Date().toLocaleDateString() };
        setReviews(updated);
        setEditIndex(null);
      } else {
        newReview = await religiousReviewService.create({ ...form, organization: orgId });
        setReviews([...reviews, newReview]);
      }
      setForm(initialReview);
    } catch (err) {
      console.error('Ошибка сохранения отзыва релорганизации:', err);
      setError(t('religiousOrgReviews.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    setForm(reviews[idx]);
    setEditIndex(idx);
  };

  const handleDelete = async (idx) => {
    const id = reviews[idx]._id;
    setLoading(true);
    setError('');
    try {
      await religiousReviewService.remove(id);
      setReviews(reviews.filter((_, i) => i !== idx));
      if (editIndex === idx) setEditIndex(null);
    } catch (err) {
      console.error('Ошибка удаления отзыва релорганизации:', err);
      setError(t('religiousOrgReviews.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>{t('religiousOrgReviews.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ReviewForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        editIndex={editIndex}
        onCancel={() => { setForm(initialReview); setEditIndex(null); }}
        isOwner={isOwner}
        t={t}
      />
      <ul className="review-list">
        {reviews.map((r, idx) => (
          <ReviewListItem
            key={r._id || idx}
            review={r}
            idx={idx}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            t={t}
          />
        ))}
      </ul>
    </section>
  );
};



export default ReligiousOrgReviews;
