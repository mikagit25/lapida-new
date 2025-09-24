import React from 'react';

const OrgDescriptionBlock = ({ description, mission, facts }) => (
  <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-2xl mx-auto">
    <h2 className="text-2xl font-semibold mb-2">Описание организации</h2>
    <p className="text-gray-700 mb-4">{description}</p>
    {mission && (
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-1">Миссия</h3>
        <p className="text-gray-600">{mission}</p>
      </div>
    )}
    {facts && facts.length > 0 && (
      <div className="flex flex-wrap gap-4 mt-2">
        {facts.map((fact, idx) => (
          <div key={idx} className="bg-blue-50 rounded px-3 py-2 text-blue-900 text-sm shadow">
            {fact}
          </div>
        ))}
      </div>
    )}
  </div>
);

export default OrgDescriptionBlock;
