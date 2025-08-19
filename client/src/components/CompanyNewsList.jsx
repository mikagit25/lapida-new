import React, { useState } from 'react';

export default function CompanyNewsList({ news }) {
  const [openIdx, setOpenIdx] = useState(null);
  if (!news || news.length === 0) {
    return <div className="text-gray-500">Нет новостей</div>;
  }
  return (
    <ul className="mb-4">
      {news.map((item, idx) => (
        <li key={idx} className="mb-2 p-3 bg-gray-100 rounded cursor-pointer">
          <div
            className="font-semibold hover:text-blue-600 transition"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            role="button"
            tabIndex={0}
            style={{ outline: 'none' }}
          >
            {item.title}
          </div>
          {openIdx === idx && (
            <div className="mt-2">
              <div className="text-gray-700 text-sm mb-1">
                {item.text && item.text.trim() !== '' ? item.text : <span className="italic text-gray-400">Нет текста новости</span>}
              </div>
              {item.date && <div className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</div>}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
