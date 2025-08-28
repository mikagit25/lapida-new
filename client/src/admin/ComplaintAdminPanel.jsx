import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

const ComplaintAdminPanel = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/complaints`)
      .then(res => res.json())
      .then(data => setComplaints(data.complaints || []));
  }, []);

  return (
    <div>
      <h3>Жалобы</h3>
      <ul>
        {complaints.map((c, idx) => (
          <li key={idx}>{c.type}: {c.text} — {c.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default ComplaintAdminPanel;
