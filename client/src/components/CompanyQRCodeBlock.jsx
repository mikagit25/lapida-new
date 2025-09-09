import React from 'react';
import QRCode from 'react-qr-code';

export default function CompanyQRCodeBlock({ url }) {
  // Ensure QR always uses /company/:slug
  let qrUrl = url;
  if (url && url.includes(window.location.origin + '/') && !url.includes('/company/')) {
    const path = url.replace(window.location.origin, '');
    qrUrl = window.location.origin + '/company/' + path.replace(/^\/?/, '');
  }
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
