import React from 'react';
import './ChatBubble.css';

/**
 * ChatBubble — универсальный компонент для отображения сообщения с аватаром, анимацией и кастомным стилем.
 * props:
 *   role: 'user' | 'ai' | 'system'
 *   avatarUrl?: string (опционально)
 *   children: содержимое сообщения
 *   isSpeaking?: boolean (для анимации волн)
 */
const ChatBubble = ({ role, avatarUrl, children, isSpeaking }) => {
  // Цвета и стили по ролям
  const isAI = role === 'ai';
  const isUser = role === 'user';
  const isSystem = role === 'system';

  return (
    <div className={`chat-bubble-row ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="chat-bubble-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="chat-bubble-avatar-img" />
          ) : (
            <div className={`chat-bubble-avatar-default ${isAI ? 'ai' : 'system'}`}>{isAI ? '🤖' : 'ℹ️'}</div>
          )}
          {isAI && isSpeaking && (
            <span className="chat-bubble-wave" />
          )}
        </div>
      )}
      <div className={`chat-bubble ${isAI ? 'ai' : isUser ? 'user' : 'system'}`}>{children}</div>
      {isUser && (
        <div className="chat-bubble-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt="avatar" className="chat-bubble-avatar-img" />
          ) : (
            <div className="chat-bubble-avatar-default user">🧑</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
