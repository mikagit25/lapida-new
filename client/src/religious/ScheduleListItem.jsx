import React from 'react';

const ScheduleListItem = ({ event, idx, isOwner, onEdit, onDelete, t }) => (
  <li key={event._id || idx}>
    <b>{event.title}</b> — {event.description} <span>{event.date} {event.time}</span> <span>{event.type}</span> <span>{event.location}</span>
    {isOwner && (
      <>
        <button onClick={() => onEdit(idx)}>{t('common.edit')}</button>
        <button onClick={() => onDelete(idx)}>{t('common.delete')}</button>
      </>
    )}
  </li>
);

export default ScheduleListItem;
