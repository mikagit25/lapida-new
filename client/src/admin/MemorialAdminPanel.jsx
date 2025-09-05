import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

const MemorialAdminPanel = () => {
  const [memorials, setMemorials] = useState([]);

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/memorials`)
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
