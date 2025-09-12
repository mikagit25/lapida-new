import React from 'react';

/**
 * Кнопки экспорта истории чата (txt, csv, pdf, email) + тултип
 * props:
 *   onExportTxt, onExportCsv, onExportPdf, onExportEmail: function
 *   disabled: boolean
 */
const ChatExportButtons = ({ onExportTxt, onExportCsv, onExportPdf, onExportEmail, disabled }) => (
  <div className="absolute top-2 right-2 flex gap-2 z-10 group">
    <button
      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded shadow-sm border border-gray-200 text-gray-700"
      onClick={onExportTxt}
      disabled={disabled}
      title="Скачать историю чата в txt"
    >
      Скачать txt
    </button>
    <button
      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded shadow-sm border border-gray-200 text-gray-700"
      onClick={onExportCsv}
      disabled={disabled}
      title="Скачать историю чата в CSV (Excel)"
    >
      Скачать CSV
    </button>
    <button
      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded shadow-sm border border-gray-200 text-gray-700"
      onClick={onExportPdf}
      disabled={disabled}
      title="Печать или сохранить как PDF"
    >
      PDF/Печать
    </button>
    <button
      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs rounded shadow-sm border border-gray-200 text-gray-700"
      onClick={onExportEmail}
      disabled={disabled}
      title="Отправить историю чата на email"
    >
      На email
    </button>
    <span className="absolute right-0 top-8 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-90 transition-opacity pointer-events-none z-20" style={{maxWidth:220}}>
      Экспортируйте историю чата для анализа или передачи психологу. <br/>TXT — для чтения, CSV — для Excel/Google Sheets.
    </span>
  </div>
);

export default ChatExportButtons;
