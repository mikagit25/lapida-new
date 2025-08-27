import React from 'react';
import DonationForm from './DonationForm';
import DonationList from './DonationList';

const PaymentManager = () => (
  <div>
    <h2>Платежи и донаты</h2>
    <DonationForm />
    <DonationList />
  </div>
);

export default PaymentManager;
