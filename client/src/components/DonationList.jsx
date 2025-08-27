import React from 'react';

const DonationList = ({ donations }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-lg font-semibold mb-4">Список донатов</h2>
    {donations.length === 0 ? (
      <div className="text-gray-500">Нет донатов для отображения.</div>
    ) : (
      <ul className="space-y-3">
        {donations.map((d, idx) => (
          <li key={d._id || idx} className="border-b pb-2">
            <div className="font-semibold text-green-700">{d.amount} ₽</div>
            <div className="text-gray-500 text-xs">{d.date}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default DonationList;
