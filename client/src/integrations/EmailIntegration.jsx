import React, { useState } from 'react';

const EmailIntegration = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/integrations/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, message })
    });
    const data = await res.json();
    setStatus(data.success ? 'Отправлено!' : 'Ошибка отправки');
  };

  return (
    <form onSubmit={handleSend} className="email-integration">
      <input
        type="email"
        placeholder="Email получателя"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <textarea
        placeholder="Сообщение"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />
      <button type="submit">Отправить Email</button>
      {status && <div>{status}</div>}
    </form>
  );
};

export default EmailIntegration;
