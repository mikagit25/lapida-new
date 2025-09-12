import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';
import { useTranslation } from 'react-i18next';

const MemorialAdminPanel = () => {
  const { t } = useTranslation();
  const [memorials, setMemorials] = useState([]);

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/memorials`)
      .then(res => res.json())
      .then(data => setMemorials(data.memorials || []));
  }, []);

  return (
    <div>
      <h3>{t('admin_memorials_title')}</h3>
      <ul>
        {memorials.map((m, idx) => (
          <li key={idx}>{m.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default MemorialAdminPanel;
