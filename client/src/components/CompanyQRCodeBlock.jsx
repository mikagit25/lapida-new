import React from 'react';
import QRCode from 'react-qr-code';

const PUBLIC_ORIGIN = import.meta.env.VITE_PUBLIC_ORIGIN || 'https://lapida.one';

// Нормализует ссылку на компанию, принудительно подставляя публичный домен и префикс /company
function buildCompanyUrl(rawUrl) {
  if (!rawUrl) return `${PUBLIC_ORIGIN}/company`;
  try {
    const parsed = new URL(rawUrl, PUBLIC_ORIGIN);
    const path = parsed.pathname.replace(/^\/+/, '');
    if (path.startsWith('company/')) return `${PUBLIC_ORIGIN}/${path}`;
    return `${PUBLIC_ORIGIN}/company/${path}`;
  } catch (e) {
    const safePath = String(rawUrl).replace(/^https?:\/\//, '').replace(/^[^/]+/, '').replace(/^\/+/, '');
    if (safePath.startsWith('company/')) return `${PUBLIC_ORIGIN}/${safePath}`;
    return `${PUBLIC_ORIGIN}/company/${safePath}`;
  }
}

export default function CompanyQRCodeBlock({ url }) {
  const qrUrl = buildCompanyUrl(url);
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">QR-код компании</h2>
      <div className="flex flex-col items-center gap-2">
        <QRCode value={qrUrl} size={128} />
        <div className="text-xs text-gray-500 break-all">{qrUrl}</div>
      </div>
    </div>
  );
}
