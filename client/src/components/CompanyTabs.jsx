import React from 'react';

export default function CompanyTabs({ tabs, currentTab, setTab }) {
  return (
    <div className="mb-6 flex gap-4 border-b pb-2">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`px-4 py-2 rounded-t font-semibold ${currentTab === t.key ? 'bg-white shadow text-blue-700' : 'bg-gray-100 text-gray-600'}`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
