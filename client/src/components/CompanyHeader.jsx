import React from 'react';
export default function CompanyHeader({ company }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <img src={company.logo} alt="Логотип" className="w-20 h-20 rounded-full object-cover border" />
      <div>
        <div className="font-bold text-2xl">{company.name}</div>
          {company.extra && (
            <div className="text-gray-500">{company.extra}</div>
          )}
      </div>
    </div>
  );
}
