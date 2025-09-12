import React from 'react';
import { useParams } from 'react-router-dom';
import CompanyAnalytics from '../../components/CompanyAnalytics';

export default function CompanyAnalyticsPage() {
  const { id, companySlug } = useParams();
  const companyId = id || companySlug;
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Аналитика компании</h1>
      <CompanyAnalytics companyId={companyId} />
    </div>
  );
}
