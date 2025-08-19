import React from 'react';
import QRCode from 'react-qr-code';

function CompanyQRCodeProfileBlock({ companyUrl }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">QR-код компании</h2>
      <div className="flex flex-col items-center gap-4">
        <QRCode value={companyUrl} size={160} />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold mt-2"
          onClick={() => {
            navigator.clipboard.writeText(companyUrl);
          }}
        >
          Поделиться ссылкой
        </button>
      </div>
    </div>
  );
}

export default CompanyQRCodeProfileBlock;
