import React from 'react';

const ComplaintList = ({ complaints }) => (
  <div>
    <h3>Список жалоб</h3>
    <ul className="complaint-list">
      {complaints.map((c, idx) => (
        <li key={idx}>
          <strong>{c.type}</strong>: {c.text} — <em>{c.status}</em>
        </li>
      ))}
    </ul>
  </div>
);

export default ComplaintList;
