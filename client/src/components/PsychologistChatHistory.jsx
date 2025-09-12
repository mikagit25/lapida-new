import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import PsychologistChatMessage from './PsychologistChatMessage';
import ChatTimeDivider from './ChatTimeDivider';
function PsychologistChatHistory({ messages, chatEndRef, loading }) {
  const { t } = useTranslation();
  const [copiedIdx, setCopiedIdx] = useState(null);
  // Прокручивать только если добавлено новое сообщение
  const prevMsgCount = useRef(messages.length);
  useEffect(() => {
    if (chatEndRef && chatEndRef.current && messages.length > prevMsgCount.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    prevMsgCount.current = messages.length;
  }, [messages, chatEndRef]);

  return (
    <div className="border rounded-lg p-4 h-96 overflow-y-auto bg-white mb-4 relative">
      {/* Пустая история */}
      {messages.length === 0 && !loading && (
        <div className="w-full flex flex-col items-center justify-center py-8 opacity-60 select-none">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse mb-2" />
          <div className="text-gray-400 text-sm">{t('start_dialog')}</div>
        </div>
      )}
      {/* Сообщения */}
      {messages.map((m, i) => {
        const isLastAI = m.role === 'ai' && i === messages.length - 1;
        const handleCopy = idx => {
          navigator.clipboard.writeText(m.content);
          setCopiedIdx(idx);
          setTimeout(() => setCopiedIdx(null), 1200);
        };
        let showTimeDivider = false;
        if (i === 0) showTimeDivider = true;
        else if (m.ts && messages[i-1].ts && (m.ts - messages[i-1].ts > 20*60*1000)) showTimeDivider = true;
        return (
          <PsychologistChatMessage
            key={i}
            m={m}
            isLastAI={isLastAI}
            copied={copiedIdx === i}
            onCopy={() => handleCopy(i)}
            showTimeDivider={showTimeDivider}
          />
        );
      })}
      {loading && (
        <div className="flex items-center gap-2 text-blue-400 text-sm animate-pulse my-2" aria-live="polite">
          <span className="w-4 h-4 rounded-full border-2 border-blue-300 border-t-blue-500 animate-spin inline-block"></span>
          <span className="w-4 h-4 rounded-full border-2 border-blue-300 border-t-blue-500 animate-spin inline-block"></span>
          <span>{t('ai_typing')}</span>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
}

export default PsychologistChatHistory;
