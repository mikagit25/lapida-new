import React, { useState } from 'react';
export default function CompanyNews({ news }) {
  const [openId, setOpenId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  if (!news || news.length === 0) return null;
  // Сортировка по дате (убывание, свежие первыми)
  const sortedNews = [...news].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA;
  });
  const latestNews = sortedNews.slice(0, 3);
  const restNews = sortedNews.slice(3);
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-xl mb-2">Новости / акции</h2>
      <ul>
        {latestNews.map(item => (
          <li key={item._id} className="mb-2">
            <button
              className="font-bold text-left w-full hover:underline"
              onClick={() => setOpenId(openId === item._id ? null : item._id)}
            >
              {item.title}
            </button>
            {openId === item._id && (
              <div className="mt-2">
                <div className="text-gray-600">{item.text}</div>
                <div className="text-xs text-gray-400">{item.date}</div>
              </div>
            )}
          </li>
        ))}
      </ul>
      {restNews.length > 0 && (
        <div className="mt-4">
          <button
            className="text-blue-600 underline mb-2"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Скрыть остальные новости' : `Показать ещё (${restNews.length})`}
          </button>
          {showAll && (
            <div style={{ maxHeight: 220, overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
              <ul>
                {restNews.map(item => (
                  <li key={item._id} className="mb-2">
                    <button
                      className="font-bold text-left w-full hover:underline"
                      onClick={() => setOpenId(openId === item._id ? null : item._id)}
                    >
                      {item.title}
                    </button>
                    {openId === item._id && (
                      <div className="mt-2">
                        <div className="text-gray-600">{item.text}</div>
                        <div className="text-xs text-gray-400">{item.date}</div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
