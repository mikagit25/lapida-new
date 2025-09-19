import React from 'react';

const ReviewListItem = ({ review, idx, isOwner, onEdit, onDelete, t }) => (
  <li key={review._id || idx}>
    <b>{review.author}</b> — {review.rating}★
    <div>{review.text}</div>
    <span>{review.date}</span>
    {isOwner && (
      <>
        <button onClick={() => onEdit(idx)}>{t('common.edit')}</button>
        <button onClick={() => onDelete(idx)}>{t('common.delete')}</button>
      </>
    )}
  </li>
);

export default ReviewListItem;
