import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';
import { useTranslation } from 'react-i18next';

const UserAdminPanel = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(data => setUsers(data.users || []));
  }, []);

  return (
    <div>
      <h3>{t('admin_users_title')}</h3>
      <ul>
        {users.map((u, idx) => (
          <li key={idx}>{u.name} ({u.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default UserAdminPanel;
