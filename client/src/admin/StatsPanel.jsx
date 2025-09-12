import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';
import { useTranslation } from 'react-i18next';

const StatsPanel = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState({ users: 0, companies: 0, memorials: 0, complaints: 0 });

  useEffect(() => {
    apiFetch(`${API_BASE_URL}/admin/stats`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div>
      <h3>{t('admin_stats_title')}</h3>
      <ul>
        <li>{t('admin_stats_users')}: {stats.users}</li>
        <li>{t('admin_stats_companies')}: {stats.companies}</li>
        <li>{t('admin_stats_memorials')}: {stats.memorials}</li>
        <li>{t('admin_stats_complaints')}: {stats.complaints}</li>
      </ul>
    </div>
  );
};

export default StatsPanel;
