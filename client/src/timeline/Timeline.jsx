import React from 'react';

const Timeline = ({ events }) => (
  <div>
    <h3>Хронология событий</h3>
    <ul className="timeline-list">
      {events.map((event, idx) => (
        <li key={idx}>
          <strong>{event.date}</strong>: {event.title} — {event.description}
        </li>
      ))}
    </ul>
  </div>
);

export default Timeline;
