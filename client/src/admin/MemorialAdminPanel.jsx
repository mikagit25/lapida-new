import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

const MemorialAdminPanel = () => {
  const [memorials, setMemorials] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/memorials`)
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
