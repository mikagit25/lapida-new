import React from 'react';
export default function CompanyNews({ news }) {
  if (!news || news.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-xl mb-2">Новости / акции</h2>
      <ul>
        {news.map(item => (
          <li key={item._id} className="mb-2">
            <div className="font-bold">{item.title}</div>
            <div className="text-gray-600">{item.text}</div>
            <div className="text-xs text-gray-400">{item.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
