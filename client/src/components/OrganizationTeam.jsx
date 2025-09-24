import React from 'react';

const OrganizationTeam = ({ team }) => {
  if (!team || team.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {team.map((m, i) => (
        <li key={i} className="border rounded p-3 bg-gray-50 flex gap-3 items-center">
          {m.photo && <img src={m.photo} alt="Фото" className="w-16 h-16 object-cover rounded-full" />}
          <div>
            <div className="font-semibold">{m.name}</div>
            <div className="text-gray-600 text-sm">{m.position}</div>
            <div className="text-gray-500 text-xs">{m.contacts}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default OrganizationTeam;
