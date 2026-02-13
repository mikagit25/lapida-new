import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// Модальное окно экстренной помощи
function EmergencyHelpModal({ open, onClose, lang = 'ru' }) {
  const closeBtnRef = useRef(null);
  useEffect(() => {
    if (open && closeBtnRef.current) closeBtnRef.current.focus();
  }, [open]);
  if (!open) return null;

  // Локализованные данные экстренной помощи
  const helpData = {
    ru: {
      title: 'Экстренная помощь',
      lines: [
        { label: 'Телефон доверия (Россия):', value: '8-800-2000-122', href: 'tel:88002000122' },
        { label: 'Психологическая помощь (Москва):', value: '8 (495) 622-51-01', href: 'tel:84956225101' },
        { label: 'Единый номер экстренных служб:', value: '112', href: 'tel:112' },
      ],
      note: 'Если вы испытываете тяжёлые переживания, не оставайтесь одни — обратитесь за помощью к близким или специалистам.'
    },
    en: {
      title: 'Emergency Help',
      lines: [
        { label: 'Suicide Prevention Lifeline (USA):', value: '1-800-273-8255', href: 'tel:18002738255' },
        { label: 'Samaritans (UK):', value: '116 123', href: 'tel:116123' },
        { label: 'Emergency number:', value: '911', href: 'tel:911' },
      ],
      note: 'If you are experiencing severe distress, do not stay alone — reach out to loved ones or professionals.'
    },
    de: {
      title: 'Notfallhilfe',
      lines: [
        { label: 'Telefonseelsorge (Deutschland):', value: '0800 1110111', href: 'tel:08001110111' },
        { label: 'Krisentelefon:', value: '0800 1110222', href: 'tel:08001110222' },
        { label: 'Notrufnummer:', value: '112', href: 'tel:112' },
      ],
      note: 'Wenn Sie schwere Belastungen erleben, bleiben Sie nicht allein – wenden Sie sich an Angehörige oder Fachleute.'
    },
    es: {
      title: 'Ayuda de emergencia',
      lines: [
        { label: 'Teléfono contra el suicidio (España):', value: '024', href: 'tel:024' },
        { label: 'Teléfono de la Esperanza:', value: '717 003 717', href: 'tel:717003717' },
        { label: 'Número de emergencia:', value: '112', href: 'tel:112' },
      ],
      note: 'Si está pasando por un momento difícil, no se quede solo — contacte con sus seres queridos o con profesionales.'
    }
  };
  const d = helpData[lang] || helpData['ru'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-label={d.title}>
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button ref={closeBtnRef} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose} aria-label={lang==='ru'?'Закрыть окно экстренной помощи':'Close emergency help window'}>&times;</button>
        <h2 className="text-xl font-bold mb-2 text-red-700" id="emergency-help-title">{d.title}</h2>
        <ul className="mb-3 text-sm">
          {d.lines.map((line, i) => (
            <li key={i}><b>{line.label}</b> <a href={line.href} className="text-blue-600 underline">{line.value}</a></li>
          ))}
        </ul>
        <div className="text-xs text-gray-500">{d.note}</div>
      </div>
    </div>
  );
}
import PsychologistChatHistory from '../components/PsychologistChatHistory';
import '../components/ChatBubble.css';
import PsychologistChatInput from '../components/PsychologistChatInput';
import PsychologistWarningBlock from '../components/PsychologistWarningBlock';
import PsychologistVoiceInput from '../components/PsychologistVoiceInput';
import PsychologistVoiceOutput from '../components/PsychologistVoiceOutput';
import ChatExportButtons from '../components/ChatExportButtons';
import ChatExportNotification from '../components/ChatExportNotification';
import ExportChatEmailModal from '../components/ExportChatEmailModal';

/**
 * ВНИМАНИЕ: Этот компонент не подключён к App.jsx и не влияет на основной сайт.
 * Подключать только после полной реализации и тестирования!
 * Рекомендуется разбивать функционал на отдельные компоненты (ChatHistory, ChatInput, WarningBlock и т.д.),
 * чтобы не перегружать основную страницу чата и облегчить поддержку.
 */

const MAX_MESSAGES = 10;


import { useAuth } from '../context/AuthContext';

const Psychologist = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [helpOpen, setHelpOpen] = useState(false);
  // Фокус на поле ввода после закрытия модального окна экстренной помощи
  useEffect(() => {
    if (!helpOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [helpOpen]);
  const [lang, setLang] = useState(i18n.language || 'ru');
  const paid = user?.paid;
  // Сохраняем историю в localStorage для анонимных (24ч)
  const LOCAL_KEY = 'psychologist_chat_history';
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_KEY);
      if (saved) {
        const { data, ts } = JSON.parse(saved);
        if (data && Array.isArray(data) && ts && Date.now() - ts < 24*60*60*1000) {
          return data;
        }
      }
    } catch (err) {
      console.error('Ошибка чтения истории психолога из localStorage:', err);
    }
    return [{ role: 'system', content: t('psychologist_system_message', { lng: lang }) }];
  });
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const chatEndRef = useRef(null);
  // Для голосового вывода: последнее AI-сообщение
  const lastAIMessage = messages.slice().reverse().find(m => m.role === 'ai')?.content || '';

  // Для бесплатных пользователей лимит, для платных — нет
  const userMessagesCount = messages.filter(m => m.role === 'user').length;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (!paid && userMessagesCount >= MAX_MESSAGES) {
      setLimitReached(true);
    } else {
      setLimitReached(false);
    }
    // Сохраняем историю для анонимных
    if (!user || !user._id) {
      // Если в сообщениях нет ts, добавить его для совместимости
      const withTs = messages.map(m => m.ts ? m : { ...m, ts: Date.now() });
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ data: withTs, ts: Date.now() }));
    }
  }, [messages, paid, user, userMessagesCount]);

  // Автофокус на поле ввода при монтировании и смене языка
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [lang]);

  // Ключевые слова для фильтрации тревожных сообщений
  const dangerWords = [
    'суицид', 'самоубий', 'не хочу жить', 'устал жить', 'покончить с собой',
    'убить себя', 'умирать', 'умираю', 'больше не могу', 'прощай',
    'suicide', 'kill myself', 'don’t want to live', 'tired of living', 'end my life',
    'goodbye', 'I want to die', 'I am dying', 'I can’t anymore'
  ];

  const checkDanger = (text) => {
    const lower = text.toLowerCase();
    return dangerWords.some(word => lower.includes(word));
  };

  // Генерация sessionId (анонимно — localStorage, авторизованный — userId)
  const [sessionId] = useState(() => {
    let sid = localStorage.getItem('psychologistSessionId');
    if (!sid) {
      sid = 'anon-' + Math.random().toString(36).slice(2) + '-' + Date.now();
      localStorage.setItem('psychologistSessionId', sid);
    }
    return sid;
  });

  const handleSend = async () => {
    if (!input.trim() || loading || (!paid && limitReached)) return;
    // Фильтрация тревожных сообщений
    if (checkDanger(input)) {
      setHelpOpen(true);
      setInput('');
      return;
    }
    const now = Date.now();
    const newMessages = [...messages, { role: 'user', content: input, ts: now }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    if (inputRef.current) inputRef.current.focus();
    try {
      const res = await fetch('/api/psychologist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: input })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'ai', content: data.reply || (lang === 'ru' ? 'Спасибо за ваш отклик. Я всегда готов выслушать.' : 'Thank you for your response. I am always here to listen.'), ts: Date.now() }]);
    } catch (e) {
      console.error('Ошибка чата психолога:', e);
      setMessages([...newMessages, { role: 'ai', content: lang === 'ru' ? 'Извините, сервис временно недоступен.' : 'Sorry, the service is temporarily unavailable.', ts: Date.now() }]);
    }
    setLoading(false);
  };

  const handleNewSession = () => {
    setMessages([{ role: 'system', content: t('psychologist_system_message', { lng: lang }) }]);
    setInput('');
    setLimitReached(false);
    if (!user || !user._id) {
      localStorage.removeItem(LOCAL_KEY);
    }
  };

  // Экспорт txt
  const handleExport = () => {
    if (!messages.length) return;
    let txt = '';
    messages.forEach(m => {
      const time = m.ts ? new Date(m.ts).toLocaleString() : '';
      const who = m.role === 'user' ? 'Пользователь' : m.role === 'ai' ? 'AI' : 'Система';
      txt += `[${time}] ${who}:\n${m.content}\n\n`;
    });
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'psychologist_chat_history.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };
  // Экспорт CSV
  const handleExportCSV = () => {
    if (!messages.length) return;
    let csv = 'Время,Кто,Сообщение\n';
    messages.forEach(m => {
      const time = m.ts ? new Date(m.ts).toLocaleString().replace(/,/g, '') : '';
      const who = m.role === 'user' ? 'Пользователь' : m.role === 'ai' ? 'AI' : 'Система';
      const content = '"' + (m.content || '').replace(/"/g, '""').replace(/\n/g, ' ') + '"';
      csv += `${time},${who},${content}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'psychologist_chat_history.csv';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };
  // Экспорт PDF (печать)
  const handleExportPDF = () => {
    let html = '<html><head><title>История чата</title>';
    html += '<style>body{font-family:sans-serif;padding:24px;} .msg{margin-bottom:16px;} .role{font-weight:bold;} .ts{color:#888;font-size:0.9em;margin-right:8px;} pre{background:#f3f3f3;padding:8px;border-radius:4px;}</style>';
    html += '</head><body>';
    html += '<h2>История чата AI-психолога</h2>';
    messages.forEach(m => {
      const time = m.ts ? new Date(m.ts).toLocaleString() : '';
      const who = m.role === 'user' ? 'Пользователь' : m.role === 'ai' ? 'AI' : 'Система';
      html += `<div class="msg"><span class="ts">[${time}]</span><span class="role">${who}:</span><br/><pre>${(m.content||'').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</pre></div>`;
    });
    html += '</body></html>';
    const win = window.open('', '_blank');
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 300);
  };

  const [exported, setExported] = useState(false);
  const [emailModal, setEmailModal] = useState(false);

  return (
    <div className="psychologist-chat-bg min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-xl w-full mx-auto py-6 px-2 sm:py-10 sm:px-4">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
        <button
          className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-200 ml-0 sm:ml-2 mt-2 sm:mt-0"
          onClick={handleNewSession}
        >
          {t('new_session')}
        </button>
  <EmergencyHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} lang={lang} />
        <button
          className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-semibold hover:bg-red-200 relative group"
          onClick={() => setHelpOpen(true)}
          aria-label={t('emergency_help_aria')}
        >
          {t('emergency_help')}
          <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-max max-w-xs bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity" role="tooltip">
            {t('emergency_help_tooltip')}
          </span>
        </button>
        <div>
          <select
            className="border rounded px-2 py-1 text-xs ml-2"
            value={lang}
            onChange={e => {
              setLang(e.target.value);
              i18n.changeLanguage(e.target.value);
              setMessages([{ role: 'system', content: t('psychologist_system_message', { lng: e.target.value }) }]);
            }}
          >
            <option value="ru">Русский</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
  <EmergencyHelpModal open={helpOpen} onClose={() => setHelpOpen(false)} lang={lang} />
      <div className="flex justify-end mb-2">
        <button
          className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs font-semibold hover:bg-red-200"
          onClick={() => setHelpOpen(true)}
        >
          {t('emergency_help')}
        </button>
      </div>
  <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">{t('psychologist_title')}</h1>
      <div className="mb-2 flex justify-center">
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {paid ? t('paid_account') : t('free_left', { count: MAX_MESSAGES - userMessagesCount })}
        </span>
      </div>
      <PsychologistWarningBlock />
      <div aria-live="polite">
        <PsychologistChatHistory 
          messages={messages} 
          chatEndRef={chatEndRef} 
          loading={loading}
        />
      </div>
      <div className="flex flex-col sm:flex-row items-stretch gap-2 mt-2">
        <div className="flex-1">
          <PsychologistChatInput
            input={input}
            setInput={setInput}
            onSend={handleSend}
            loading={loading}
            limitReached={!paid && limitReached}
            inputRef={inputRef}
          />
        </div>
        <div className="flex flex-row gap-2 justify-end sm:justify-start">
          <PsychologistVoiceInput onResult={setInput} disabled={loading || (!paid && limitReached)} />
          <PsychologistVoiceOutput text={lastAIMessage} disabled={loading} />
        </div>
      </div>

      {/* Кнопки экспорта и уведомления теперь в самом низу страницы, под диалогом */}
      <div className="flex flex-col items-center mt-4">
        <ChatExportButtons
          onExportTxt={handleExport}
          onExportCsv={handleExportCSV}
          onExportPdf={handleExportPDF}
          onExportEmail={() => setEmailModal(true)}
          disabled={!messages.length}
        />
        <ChatExportNotification show={exported} />
        <ExportChatEmailModal open={emailModal} onClose={()=>setEmailModal(false)} messages={messages} />
      </div>
  {/* Кнопки экспорта и уведомления теперь внутри блока истории чата */}
      {!paid && limitReached && (
        <div className="text-red-500 text-xs sm:text-sm mt-2 text-center">
          {t('limit_reached')}<br />
          <a href="/psychologist-subscription" className="underline text-blue-600">{t('subscribe_link')}</a> {t('or_register')}
        </div>
      )}
      </div>
    </div>
  );
};

export default Psychologist;
