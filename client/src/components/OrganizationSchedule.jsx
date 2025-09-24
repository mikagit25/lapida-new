import React from 'react';

const OrganizationSchedule = ({ schedule }) => {
  if (!schedule || schedule.length === 0) return null;
  return (
    <ul className="divide-y divide-gray-200">
      {schedule.map((ev, i) => (
        <li key={i} className="py-2">
          <div className="font-semibold">{ev.title} {ev.date && (<span className="text-gray-500 text-sm">({new Date(ev.date).toLocaleDateString()})</span>)}</div>
          <div className="text-gray-600 text-sm">{ev.description}</div>
        </li>
      ))}
    </ul>
  );
};

export default OrganizationSchedule;
