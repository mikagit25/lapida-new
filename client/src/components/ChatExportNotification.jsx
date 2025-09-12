import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Всплывающее уведомление об успешном экспорте
 * props:
 *   show: boolean
 */
const ChatExportNotification = ({ show }) => {
  const { t } = useTranslation();
  return show ? (
    <div className="absolute top-10 right-2 bg-green-100 text-green-800 text-xs px-3 py-1 rounded shadow border border-green-200 animate-fadein z-10">
      {t('chat_downloaded')}
    </div>
  ) : null;
};

export default ChatExportNotification;
