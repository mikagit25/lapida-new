import React from 'react';

const CompanyRegionSearch = ({ region, setRegion, onGeoSearch }) => (
  <div className="flex gap-2 items-center">
    <input
      type="text"
      placeholder="Регион или город..."
      value={region}
      onChange={e => setRegion(e.target.value)}
      className="border px-3 py-2 rounded-md"
    />
    <button
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      onClick={onGeoSearch}
      type="button"
    >
      Найти ближайшие
    </button>
  </div>
);

export default CompanyRegionSearch;
