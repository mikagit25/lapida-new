import React from 'react';

const Timeline = ({ events }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-lg font-semibold mb-4">События</h2>
    {events.length === 0 ? (
      <div className="text-gray-500">Нет событий для отображения.</div>
    ) : (
      <ul className="space-y-4">
        {events.map(event => (
          <li key={event._id || event.id} className="border-b pb-2">
            <div className="font-semibold text-blue-700">{event.title || event.name}</div>
            <div className="text-gray-600 text-sm">{event.date}</div>
            <div className="text-gray-700 mt-1">{event.description}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default Timeline;
