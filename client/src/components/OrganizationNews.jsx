import React from 'react';

const OrganizationNews = ({ news }) => {
  if (!news || news.length === 0) return null;
  return (
    <ul className="divide-y divide-gray-200">
      {news.map((n, i) => (
        <li key={i} className="py-2">
          <div className="font-semibold">{n.title} {n.date && (<span className="text-gray-500 text-sm">({new Date(n.date).toLocaleDateString()})</span>)}</div>
          <div className="text-gray-600 text-sm">{n.text}</div>
        </li>
      ))}
    </ul>
  );
};

export default OrganizationNews;
