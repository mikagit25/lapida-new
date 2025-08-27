import React, { useEffect, useState } from 'react';

const UserAdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
  }, []);

  return (
    <div>
      <h3>Пользователи</h3>
      <ul>
        {users.map((u, idx) => (
          <li key={idx}>{u.name} ({u.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default UserAdminPanel;
