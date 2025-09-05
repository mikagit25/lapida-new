import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

const DonationForm = ({ onDonate }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiFetch(`${API_BASE_URL}/payments/donate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    setAmount('');
    if (onDonate) onDonate();
  };

  return (
    <form onSubmit={handleSubmit} className="donation-form">
      <input
        type="number"
        min="1"
        placeholder="Сумма доната"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        required
      />
      <button type="submit">Пожертвовать</button>
    </form>
  );
};

export default DonationForm;
