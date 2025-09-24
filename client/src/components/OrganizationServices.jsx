import React from 'react';

const OrganizationServices = ({ services }) => {
  if (!services || services.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {services.map((s, i) => (
        <li key={i} className="border rounded p-3 bg-gray-50">
          <div className="font-semibold">{s.name}</div>
          <div className="text-gray-600 text-sm mb-1">{s.description}</div>
          {s.price && <div className="text-blue-700 font-bold">Цена: {s.price} ₽</div>}
          <div className={s.available ? 'text-green-600' : 'text-red-600'}>{s.available ? 'Доступна' : 'Недоступна'}</div>
        </li>
      ))}
    </ul>
  );
};

export default OrganizationServices;
