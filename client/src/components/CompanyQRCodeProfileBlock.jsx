import React from 'react';
import QRCode from 'react-qr-code';

const PUBLIC_ORIGIN = import.meta.env.VITE_PUBLIC_ORIGIN || 'https://lapida.one';

function buildCompanyUrl(companyUrl, customSlug, companyId) {
  if (customSlug) return `${PUBLIC_ORIGIN}/company/${customSlug}`;
  if (companyId) return `${PUBLIC_ORIGIN}/company/${companyId}`;
  if (companyUrl) {
    try {
      const parsed = new URL(companyUrl, PUBLIC_ORIGIN);
      const path = parsed.pathname.replace(/^\/+/, '');
      if (path.startsWith('company/')) return `${PUBLIC_ORIGIN}/${path}`;
      return `${PUBLIC_ORIGIN}/company/${path}`;
    } catch (e) {}
  }
  return `${PUBLIC_ORIGIN}/company`;
}

function CompanyQRCodeProfileBlock({ companyUrl, customSlug, companyId }) {
  const url = buildCompanyUrl(companyUrl, customSlug, companyId);
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-lg font-semibold mb-4">QR-код компании</h2>
      <div className="flex flex-col items-center gap-4">
        <QRCode value={url} size={160} />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold mt-2"
          onClick={() => {
            navigator.clipboard.writeText(url);
          }}
        >
          Поделиться ссылкой
        </button>
      </div>
    </div>
  );
}

export default CompanyQRCodeProfileBlock;
