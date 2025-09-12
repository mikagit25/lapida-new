import React from 'react';
import { useParams } from 'react-router-dom';
import CrmCompanyOrders from '../../pages/CrmCompanyOrders';

export default function CompanyCrmOrdersPage() {
  const { id, companySlug } = useParams();
  // Можно пробрасывать id/slug для CRM интеграции
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">CRM: Заказы компании</h1>
      <CrmCompanyOrders />
    </div>
  );
}
