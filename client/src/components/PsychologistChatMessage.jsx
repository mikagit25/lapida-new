
import React from 'react';
import ReactMarkdown from 'react-markdown';
import ChatBubble from './ChatBubble';
import './ChatBubble.css';
import { useTranslation } from 'react-i18next';

/**
 * Компонент одного сообщения чата (с копированием, markdown, индикаторами)
 * props:
 *   m: {role, content, ts}
 *   isLastAI: boolean
 *   copied: boolean
 *   onCopy: function
 *   showTimeDivider: boolean
 */

const PsychologistChatMessage = ({ m, isLastAI, copied, onCopy, showTimeDivider }) => {
  const { t } = useTranslation();
  return (
    <>
      {showTimeDivider && (
        <div className="text-center text-gray-400 text-xs my-2 select-none">
          {m.ts ? new Date(m.ts).toLocaleString() : ''}
        </div>
      )}
      <ChatBubble role={m.role} isSpeaking={isLastAI && m.role === 'ai'}>
        <ReactMarkdown
          components={{
            a: props => <a {...props} className="underline text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer" />,
            li: props => <li {...props} className="ml-4 list-disc" />,
            strong: props => <strong {...props} className="font-semibold" />,
            em: props => <em {...props} className="italic" />,
            code: props => <code {...props} className="bg-gray-100 px-1 rounded text-xs" />,
          }}
        >
          {m.content}
        </ReactMarkdown>
        {m.role === 'ai' && (
          <button
            className="ml-2 px-1 py-0.5 text-xs rounded bg-gray-200 hover:bg-gray-300 text-gray-700 opacity-70 hover:opacity-100 transition-opacity focus:outline-blue-400"
            style={{fontSize:'0.8em'}}
            title={copied ? t('copied') : t('copy_answer')}
            aria-label={copied ? t('copied') : t('copy_answer')}
            onClick={onCopy}
          >
            {copied ? '✔️' : '📋'}
          </button>
        )}
        {isLastAI && (
          <span className="inline-block align-middle ml-2 w-2 h-2 rounded-full bg-blue-400 animate-pulse" title={t('new_message')} aria-label={t('new_message')}></span>
        )}
      </ChatBubble>
    </>
  );
};

export default PsychologistChatMessage;
