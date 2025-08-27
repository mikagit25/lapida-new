import React, { useState } from 'react';

const PushNotificationDemo = () => {
  const [status, setStatus] = useState('');

  const handlePush = async () => {
    // DEMO: push notification (реальная интеграция через сервис-воркер)
    setStatus('Push отправлен (демо)');
  };

  return (
    <div>
      <button onClick={handlePush}>Отправить Push</button>
      {status && <div>{status}</div>}
    </div>
  );
};

export default PushNotificationDemo;
