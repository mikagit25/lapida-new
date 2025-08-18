import React, { useRef } from 'react';

export default function CompanyHeader({ company, canEdit, onHeaderBgUpload }) {
  const fileInputRef = useRef();
  return (
    <div className="relative w-full mb-4">
      {/* Горизонтальные обои */}
      {company.headerBackground && (
        <div className="absolute inset-0 h-40 w-full z-0">
          <img
            src={company.headerBackground}
            alt="Обои компании"
            className="w-full h-40 object-cover rounded-t-xl"
            style={{ filter: 'brightness(0.85)' }}
          />
        </div>
      )}
      <div className="relative flex items-center gap-4 h-40 z-10 px-6">
        <img src={company.logo} alt="Логотип" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-white" />
        <div>
          <div className="font-bold text-2xl text-white drop-shadow-lg">{company.name}</div>
          {company.extra && (
            <div className="text-gray-200 drop-shadow">{company.extra}</div>
          )}
        </div>
        {canEdit && (
          <div className="ml-auto">
            <button
              className="bg-white bg-opacity-80 hover:bg-blue-600 hover:text-white text-blue-600 px-4 py-2 rounded shadow font-semibold"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              Загрузить/сменить обои
            </button>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={onHeaderBgUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
}
