import React from 'react';

const MemorialSidebar = ({ memorial }) => {
  if (!(memorial.birthPlace || memorial.deathPlace)) return null;
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Места</h3>
      <div className="space-y-3">
        {memorial.birthPlace && (
          <div>
            <span className="text-gray-600 block">Место рождения</span>
            <span className="font-semibold">{memorial.birthPlace}</span>
          </div>
        )}
        {memorial.deathPlace && (
          <div>
            <span className="text-gray-600 block">Место смерти</span>
            <span className="font-semibold">{memorial.deathPlace}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemorialSidebar;
