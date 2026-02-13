import React from 'react';
import CrmCompanyOrders from '../../pages/CrmCompanyOrders';

export default function CompanyCrmOrdersPage() {
  // Можно пробрасывать id/slug для CRM интеграции
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">CRM: Заказы компании</h1>
      <CrmCompanyOrders />
    </div>
  );
}
