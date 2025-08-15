import React from 'react';
export default function CompanyInfo({ company }) {
  return (
    <div className="mb-4">
      <div className="text-gray-700">Адрес: {company.address}</div>
      <div className="text-gray-700">ИНН: {company.inn}</div>
      <div className="text-gray-700">{company.description}</div>
    </div>
  );
}
