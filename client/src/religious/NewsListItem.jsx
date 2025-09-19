import React from 'react';

const NewsListItem = ({ news, idx, isOwner, onEdit, onDelete, t, onSelect }) => (
  <li key={news._id || idx}>
    <b>{news.title}</b> — {news.publishedAt && new Date(news.publishedAt).toLocaleString()}
    <div>{news.text}</div>
    {news.images && news.images.length > 0 && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {news.images.map((img, i) => (
          <img key={i} src={img} alt="news" style={{ maxWidth: 80, margin: 4 }} />
        ))}
      </div>
    )}
    <button onClick={() => onSelect(news)}>{t('religiousOrgNews.view')}</button>
    {isOwner && (
      <>
        <button onClick={() => onEdit(idx)}>{t('common.edit')}</button>
        <button onClick={() => onDelete(idx)}>{t('common.delete')}</button>
      </>
    )}
  </li>
);

export default NewsListItem;
