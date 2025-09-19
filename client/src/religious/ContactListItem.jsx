import React from 'react';

const ContactListItem = ({ contact, idx, isOwner, onEdit, onDelete, t }) => (
  <li key={contact._id || idx} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ fontSize: 20 }}>{contact.icon}</span>
    <span>{contact.value}</span>
    {isOwner && (
      <>
        <button onClick={() => onEdit(idx)}>{t('common.edit')}</button>
        <button onClick={() => onDelete(idx)}>{t('common.delete')}</button>
      </>
    )}
  </li>
);

export default ContactListItem;
