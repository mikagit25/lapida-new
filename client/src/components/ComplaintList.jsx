import React from 'react';

const ComplaintList = ({ complaints }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-lg font-semibold mb-4">Список жалоб</h2>
    {complaints.length === 0 ? (
      <div className="text-gray-500">Нет жалоб для отображения.</div>
    ) : (
      <ul className="space-y-3">
        {complaints.map((c, idx) => (
          <li key={c._id || idx} className="border-b pb-2">
            <div className="font-semibold text-red-700">{c.type}</div>
            <div className="text-gray-700 mt-1">{c.text}</div>
            <div className="text-gray-500 text-xs">{c.date}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default ComplaintList;
