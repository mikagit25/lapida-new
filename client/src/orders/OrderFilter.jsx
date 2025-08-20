import React from 'react';

const statuses = [
  'all',
  'new',
  'pending',
  'confirmed',
  'shipped',
  'completed',
  'cancelled'
];

const OrderFilter = ({ value, onChange }) => (
  <div className="order-filter">
    <label htmlFor="order-status">Статус заказа:</label>
    <select id="order-status" value={value} onChange={e => onChange(e.target.value)}>
      {statuses.map(status => (
        <option key={status} value={status}>{status === 'all' ? 'Все' : status}</option>
      ))}
    </select>
  </div>
);

export default OrderFilter;
