import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config/api';

const StatsPanel = () => {
  const [stats, setStats] = useState({ users: 0, companies: 0, memorials: 0, complaints: 0 });

  useEffect(() => {
    fetch(`${API_BASE_URL}/admin/stats`)
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  return (
    <div>
      <h3>Статистика</h3>
      <ul>
        <li>Пользователей: {stats.users}</li>
        <li>Компаний: {stats.companies}</li>
        <li>Мемориалов: {stats.memorials}</li>
        <li>Жалоб: {stats.complaints}</li>
      </ul>
    </div>
  );
};

export default StatsPanel;
