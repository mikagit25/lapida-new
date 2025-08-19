import React from 'react';
import { useParams } from 'react-router-dom';
import OrderListCompany from './OrderListCompany';

export default function CompanyOrdersPage() {
  const { companyId } = useParams();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Заказы компании</h1>
        <OrderListCompany companyId={companyId} />
      </div>
    </div>
  );
}
