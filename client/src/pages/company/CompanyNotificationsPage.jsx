import React from 'react';
import { useParams } from 'react-router-dom';
import CompanyNotificationsList from '../../components/CompanyNotificationsList';

export default function CompanyNotificationsPage() {
  const { id, companySlug } = useParams();
  const companyId = id || companySlug;
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Уведомления компании</h1>
      <CompanyNotificationsList companyId={companyId} />
    </div>
  );
}
