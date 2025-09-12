import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Кнопки экспорта истории чата (txt, csv, pdf, email) + тултип
 * props:
 *   onExportTxt, onExportCsv, onExportPdf, onExportEmail: function
 *   disabled: boolean
 */
const ChatExportButtons = ({ onExportTxt, onExportCsv, onExportPdf, onExportEmail, disabled }) => {
  const { t } = useTranslation();
  return (
    <div className="absolute top-2 right-2 flex gap-2 z-10 group">
      <button
        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded shadow-sm border border-gray-200 text-gray-700"
        onClick={onExportTxt}
        disabled={disabled}
        title={t('export_txt')}
      >
        {t('export_txt')}
      </button>
      <button
        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded shadow-sm border border-gray-200 text-gray-700"
        onClick={onExportCsv}
        disabled={disabled}
        title={t('export_csv')}
      >
        {t('export_csv')}
      </button>
      <button
        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded shadow-sm border border-gray-200 text-gray-700"
        onClick={onExportPdf}
        disabled={disabled}
        title={t('export_pdf')}
      >
        {t('export_pdf')}
      </button>
      <button
        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded shadow-sm border border-gray-200 text-gray-700"
        onClick={onExportEmail}
        disabled={disabled}
        title={t('export_email')}
      >
        {t('export_email')}
      </button>
      <span className="absolute right-0 top-8 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-90 transition-opacity pointer-events-none z-20" style={{maxWidth:220}}>
        {t('export_tooltip')}
      </span>
    </div>
  );
};

export default ChatExportButtons;
