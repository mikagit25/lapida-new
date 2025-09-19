import React from 'react';

const DocumentListItem = ({ doc, idx, isOwner, onEdit, onDelete, t, onSelect }) => (
  <li key={doc._id || idx}>
    <b>{doc.title}</b> — {doc.publishedAt && new Date(doc.publishedAt).toLocaleString()}
    <div>{doc.description}</div>
    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" download>
      <button>{t('religiousOrgDocuments.downloadDoc')}</button>
    </a>
    <button onClick={() => onSelect(doc)}>{t('religiousOrgDocuments.view')}</button>
    {isOwner && (
      <>
        <button onClick={() => onEdit(idx)}>{t('common.edit')}</button>
        <button onClick={() => onDelete(idx)}>{t('common.delete')}</button>
      </>
    )}
  </li>
);

export default DocumentListItem;
