import React, { useState, useEffect } from 'react';
import EmailIntegration from './EmailIntegration';
import SmsIntegration from './SmsIntegration';
import { apiFetch } from '../services/apiFetch';

const IntegrationManager = () => {
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/integrations');
      const data = await res.json();
      setStatus(data.status || {});
      setError('');
    } catch (e) {
      console.error('Ошибка загрузки статуса интеграций', e);
      setError('Ошибка загрузки статуса интеграций');
      setStatus({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Интеграции</h1>
      {loading && <div>Загрузка...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <EmailIntegration status={status.email} />
      <SmsIntegration status={status.sms} />
    </div>
  );
};

export default IntegrationManager;
