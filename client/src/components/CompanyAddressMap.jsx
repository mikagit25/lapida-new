import React from 'react';
import CompanyMap from './CompanyMap';

export default function CompanyAddressMap({ editForm, setEditForm, mapError, setMapError, editLoading, editError, editSuccess, handleEditCompany }) {
  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Адрес и карта</h2>
      <CompanyMap
        address={editForm.address}
        lat={editForm.lat}
        lng={editForm.lng}
        setAddress={addr => setEditForm(f => ({ ...f, address: addr }))}
        setLat={lat => setEditForm(f => ({ ...f, lat }))}
        setLng={lng => setEditForm(f => ({ ...f, lng }))}
        foundAddress={editForm.foundAddress}
        setFoundAddress={fa => setEditForm(f => ({ ...f, foundAddress: fa }))}
        mapError={mapError}
        setMapError={setMapError}
      />
      <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold mt-4" disabled={editLoading} onClick={handleEditCompany}>
        {editLoading ? 'Сохранение...' : 'Сохранить адрес и координаты'}
      </button>
      {editError && <div className="text-red-600 text-sm mt-2">{editError}</div>}
      {editSuccess && <div className="text-green-600 text-sm mt-2">{editSuccess}</div>}
    </div>
  );
}
