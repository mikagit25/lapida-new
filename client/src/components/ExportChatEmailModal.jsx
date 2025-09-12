import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Модальное окно для экспорта истории чата на email
 * props:
 *   open: boolean
 *   onClose: function
 *   messages: [{role, content, ts}]
 */
const ExportChatEmailModal = ({ open, onClose, messages }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const { t } = useTranslation();
  if (!open) return null;

  const handleSend = async () => {
    setStatus('');
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus(t('input_email'));
      return;
    }
    let txt = '';
    messages.forEach(m => {
      const time = m.ts ? new Date(m.ts).toLocaleString() : '';
      const who = m.role === 'user' ? 'Пользователь' : m.role === 'ai' ? 'AI' : 'Система';
      txt += `[${time}] ${who}:\n${m.content}\n\n`;
    });
  setStatus(t('send'));
    try {
      const res = await fetch('/api/psychologist/send-chat-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, text: txt })
      });
      if (res.ok) {
        setStatus(t('sent'));
        setTimeout(() => { onClose(); setStatus(''); setEmail(''); }, 2000);
      } else {
        setStatus(t('send_error'));
      }
    } catch {
      setStatus(t('network_error'));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xs w-full p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Закрыть">&times;</button>
  <h2 className="text-lg font-bold mb-2">{t('send_to_email')}</h2>
        <input
          type="email"
          className="border rounded px-2 py-1 w-full mb-2"
          placeholder={t('your_email')}
          value={email}
          onChange={e=>setEmail(e.target.value)}
          autoFocus
        />
        <button
          className="w-full bg-blue-600 text-white rounded py-1 font-semibold mb-2 disabled:bg-gray-300"
          onClick={handleSend}
          disabled={!email}
        >
          {t('send')}
        </button>
        {status && <div className="text-xs text-center mt-1" style={{color:status.includes('ошиб')?'#c00':'#090'}}>{status}</div>}
      </div>
    </div>
  );
};

export default ExportChatEmailModal;
