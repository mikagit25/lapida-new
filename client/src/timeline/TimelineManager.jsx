import React, { useState, useEffect } from 'react';
import Timeline from './Timeline';

const TimelineManager = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/timeline-events')
      .then(res => res.json())
      .then(data => setEvents(data.events || []));
  }, []);

  // TODO: Add form for adding/editing events

  return (
    <div>
      <h2>Хронология</h2>
      <Timeline events={events} />
    </div>
  );
};

export default TimelineManager;
