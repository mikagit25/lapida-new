import React from 'react';

const OrderListItem = ({ order, idx, isOwner, onEdit, onDelete, t, onSelect, statusOptions }) => (
  <li key={order._id || idx}>
    <b>{order.customerName}</b> — {order.product} x{order.quantity} <span>{statusOptions.find(opt => opt.value === order.status)?.label}</span>
    <div>{order.comment}</div>
    <button onClick={() => onSelect(order)}>{t('religiousOrgOrders.view')}</button>
    {isOwner && (
      <>
        <button onClick={() => onEdit(idx)}>{t('common.edit')}</button>
        <button onClick={() => onDelete(idx)}>{t('common.delete')}</button>
      </>
    )}
  </li>
);

export default OrderListItem;
