import React from 'react';
import OrderListClient from './OrderListClient';

export default function ClientOrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">Мои заказы</h1>
        <OrderListClient />
      </div>
    </div>
  );
}
