import React from 'react';

export default function OrderBuyerInfo({ user }) {
  if (!user) return null;
  return (
    <div className="pl-2">
      <div className="font-semibold text-blue-800">{user.name || '—'}</div>
      {user.phone && <div className="text-sm text-gray-700">📞 {user.phone}</div>}
      {user.email && <div className="text-sm text-gray-700">✉️ {user.email}</div>}
      {user.address && <div className="text-sm text-gray-700">🏠 {user.address}</div>}
    </div>
  );
}
