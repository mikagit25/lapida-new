// Пример подключения новых CRM-компонентов на отдельной странице
import React from 'react';
import ProductCardCRM from './ProductCardCRM';
import OrderButtonCRM from './OrderButtonCRM';
import OrderStatusCRM from './OrderStatusCRM';
import CompanyProfileCRM from './CompanyProfileCRM';
import ContactProfileCRM from './ContactProfileCRM';

const ExampleCRMIntegrationPage = () => {
  // Пример данных для компании и пользователя
  const companyData = {
    name: 'ООО "Пример"',
    industry: 'IT',
    phoneNumber: '+7 999 123-45-67',
    emailAddress: 'company@example.com',
  };
  const contactData = {
    firstName: 'Иван',
    lastName: 'Иванов',
    emailAddress: 'ivanov@example.com',
    phoneNumber: '+7 999 765-43-21',
  };
  // Пример ID товара и заказа (заменить на реальные)
  const productId = 'demo-product-id';
  const userId = 'demo-user-id';
  const orderId = 'demo-order-id';

  return (
    <div style={{ padding: 32 }}>
      <h1>Интеграция сайта с EspoCRM</h1>
      <ProductCardCRM />
      <OrderButtonCRM productId={productId} userId={userId} />
      <OrderStatusCRM orderId={orderId} />
      <CompanyProfileCRM companyData={companyData} />
      <ContactProfileCRM contactData={contactData} />
    </div>
  );
};

export default ExampleCRMIntegrationPage;
