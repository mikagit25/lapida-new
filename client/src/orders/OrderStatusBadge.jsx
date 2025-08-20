import React from 'react';

export default function OrderStatusBadge({ status }) {
  let color = 'bg-gray-100 text-gray-800';
  if (status === 'new') color = 'bg-yellow-100 text-yellow-800';
  else if (status === 'cancelled') color = 'bg-red-100 text-red-800';
  else if (status === 'completed') color = 'bg-green-100 text-green-800';
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>{status}</span>
  );
}
