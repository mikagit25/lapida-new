import React from 'react';
import UserAdminPanel from './UserAdminPanel';
import CompanyAdminPanel from './CompanyAdminPanel';
import MemorialAdminPanel from './MemorialAdminPanel';
import ComplaintAdminPanel from './ComplaintAdminPanel';
import StatsPanel from './StatsPanel';

const AdminDashboard = () => (
  <div>
    <h2>Админ-кабинет</h2>
    <StatsPanel />
    <UserAdminPanel />
    <CompanyAdminPanel />
    <MemorialAdminPanel />
    <ComplaintAdminPanel />
  </div>
);

export default AdminDashboard;
