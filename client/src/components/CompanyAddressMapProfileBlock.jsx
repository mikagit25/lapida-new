import React from 'react';

function CompanyAddressMapProfileBlock({ address, lat, lng }) {
  if (!address && !(lat && lng)) return null;
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-xl mb-2">Адрес и карта</h2>
      {address && <div className="mb-2">Адрес: {address}</div>}
      {(lat && lng) && (
        <div className="mb-2">
          <div className="text-sm text-gray-500">Координаты: {lat}, {lng}</div>
          <div style={{ height: '250px', width: '100%' }}>
            <iframe
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`}
              style={{ border: 0, width: '100%', height: '100%' }}
              allowFullScreen=""
              loading="lazy"
              title="Карта компании"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyAddressMapProfileBlock;
