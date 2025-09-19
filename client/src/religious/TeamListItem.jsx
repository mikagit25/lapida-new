import React from 'react';

const TeamListItem = ({ member, idx, isOwner, onEdit, onDelete, t, onSelect }) => (
  <li key={member._id || idx}>
    <b>{member.name}</b> — {member.position}
    {member.photo && <img src={member.photo} alt={member.name} style={{ maxWidth: 40, maxHeight: 40, marginLeft: 8, borderRadius: 8 }} />}
    <button onClick={() => onSelect(member)}>{t('religiousOrgTeam.view')}</button>
    {isOwner && (
      <>
        <button onClick={() => onEdit(idx)}>{t('common.edit')}</button>
        <button onClick={() => onDelete(idx)}>{t('common.delete')}</button>
      </>
    )}
  </li>
);

export default TeamListItem;
