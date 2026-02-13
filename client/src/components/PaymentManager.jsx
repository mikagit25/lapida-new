import React, { useState, useEffect } from 'react';
import DonationForm from './DonationForm';
import DonationList from './DonationList';
import { apiFetch } from '../services/apiFetch';

const PaymentManager = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/payments');
      const data = await res.json();
      setDonations(data.donations || []);
      setError('');
    } catch (e) {
      console.error('Ошибка загрузки донатов', e);
      setError('Ошибка загрузки донатов');
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async (amount) => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      if (res.ok) fetchDonations();
    } catch (e) {
      console.error('Ошибка отправки доната', e);
      setError('Ошибка отправки доната');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Платежи и донаты</h1>
      <DonationForm onDonate={handleDonate} />
      {loading && <div>Загрузка...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <DonationList donations={donations} />
    </div>
  );
};

export default PaymentManager;
