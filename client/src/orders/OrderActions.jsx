import React from 'react';

const OrderActions = ({ order, onCancel, onRepeat }) => (
  <div className="order-actions">
    <button onClick={() => onCancel(order)} disabled={order.status === 'cancelled'}>Отменить</button>
    <button onClick={() => onRepeat(order)}>Повторить</button>
  </div>
);

export default OrderActions;
