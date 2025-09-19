import React from 'react';

const ServiceListItem = ({ service, idx, isOwner, onEdit, onDelete, t }) => (
  <li key={service._id || idx}>
    <b>{service.name}</b> — {service.description} {service.price && `| ${service.price}₽`} {service.available ? '' : `(${t('religiousOrgServices.unavailable')})`}
    {isOwner && (
      <>
        <button onClick={() => onEdit(idx)}>{t('common.edit')}</button>
        <button onClick={() => onDelete(idx)}>{t('common.delete')}</button>
      </>
    )}
  </li>
);

export default ServiceListItem;
