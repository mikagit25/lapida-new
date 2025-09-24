import React from 'react';

const OrgFactsBlock = ({ facts }) => {
  if (!facts || facts.length === 0) return null;
  return (
    <div className="bg-blue-50 rounded-xl shadow p-6 mb-8 max-w-2xl mx-auto flex flex-wrap gap-4 justify-center">
      {facts.map((fact, idx) => (
        <div key={idx} className="bg-white rounded px-4 py-2 text-blue-900 text-base shadow">
          {fact}
        </div>
      ))}
    </div>
  );
};

export default OrgFactsBlock;
