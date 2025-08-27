import React, { useEffect, useState } from 'react';

const MemorialAdminPanel = () => {
  const [memorials, setMemorials] = useState([]);

  useEffect(() => {
    fetch('/api/memorials')
      .then(res => res.json())
      .then(data => setMemorials(data.memorials || []));
  }, []);

  return (
    <div>
      <h3>Мемориалы</h3>
      <ul>
        {memorials.map((m, idx) => (
          <li key={idx}>{m.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MemorialAdminPanel;
