/** Компонент поля ввода и кнопки отправки для AI-психолога */
import React from 'react';
import { useTranslation } from 'react-i18next';

const PsychologistChatInput = ({ input, setInput, onSend, loading, limitReached, inputRef }) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2 items-end">
      <textarea
        ref={inputRef}
        className="w-full border rounded px-2 py-1 text-sm resize-none focus:outline-blue-400"
        rows={1}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) {
              onSend();
              setInput('');
            }
          }
        }}
        disabled={loading || limitReached}
        placeholder={limitReached ? t('chat_limit_reached') : t('chat_input_placeholder')}
      />
      <button
        className={`ml-2 px-4 py-1 rounded bg-blue-600 text-white font-semibold text-sm disabled:bg-gray-300 disabled:text-gray-500 flex items-center justify-center min-w-[90px]`}
        onClick={() => {
          if (input.trim()) {
            onSend();
            setInput('');
          }
        }}
        disabled={loading || limitReached || !input.trim()}
        aria-label={t('send_message')}
      >
        {loading ? (
          <svg className="animate-spin h-5 w-5 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        ) : null}
        {loading ? '...' : t('send')}
      </button>
    </div>
  );
};

export default PsychologistChatInput;