import React from 'react';

/**
 * Всплывающее уведомление об успешном экспорте
 * props:
 *   show: boolean
 */
const ChatExportNotification = ({ show }) => (
  show ? (
    <div className="absolute top-10 right-2 bg-green-100 text-green-800 text-xs px-3 py-1 rounded shadow border border-green-200 animate-fadein z-10">
      История чата скачана
    </div>
  ) : null
);

export default ChatExportNotification;
