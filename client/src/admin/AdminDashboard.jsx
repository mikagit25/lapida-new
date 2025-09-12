import React from 'react';
import UserAdminPanel from './UserAdminPanel';
import CompanyAdminPanel from './CompanyAdminPanel';
import MemorialAdminPanel from './MemorialAdminPanel';
import ComplaintAdminPanel from './ComplaintAdminPanel';
import StatsPanel from './StatsPanel';
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t('admin_dashboard_title')}</h2>
      <StatsPanel />
      <UserAdminPanel />
      <CompanyAdminPanel />
      <MemorialAdminPanel />
      <ComplaintAdminPanel />
    </div>
  );
};

export default AdminDashboard;
