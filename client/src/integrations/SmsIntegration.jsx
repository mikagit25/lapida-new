import React, { useState } from 'react';

const SmsIntegration = () => {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/integrations/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, message })
    });
    const data = await res.json();
    setStatus(data.success ? 'Отправлено!' : 'Ошибка отправки');
  };

  return (
    <form onSubmit={handleSend} className="sms-integration">
      <input
        type="tel"
        placeholder="Телефон получателя"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        required
      />
      <textarea
        placeholder="Сообщение"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />
      <button type="submit">Отправить SMS</button>
      {status && <div>{status}</div>}
    </form>
  );
};

export default SmsIntegration;
