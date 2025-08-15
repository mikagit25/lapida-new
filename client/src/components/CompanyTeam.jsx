import React from 'react';
export default function CompanyTeam({ team }) {
  if (!team || team.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-xl mb-2">Команда</h2>
      <div className="flex flex-wrap gap-4">
        {team.map(member => (
          <div key={member._id} className="border rounded p-4 w-48">
            <img src={member.photo} alt={member.name} className="w-16 h-16 object-cover rounded-full mb-2" />
            <div className="font-bold">{member.name}</div>
            <div className="text-gray-600 text-sm">{member.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
