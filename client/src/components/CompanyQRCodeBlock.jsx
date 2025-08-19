import React from 'react';
import QRCode from 'react-qr-code';

export default function CompanyQRCodeBlock({ url }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-2">QR-код компании</h2>
      <div className="flex flex-col items-center gap-2">
        <QRCode value={url} size={128} />
        <div className="text-xs text-gray-500 break-all">{url}</div>
      </div>
    </div>
  );
}
