
import React from 'react';
import { useTranslation } from 'react-i18next';


const TokensDocs = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <h2 className="text-2xl font-bold mb-4">{t('tokens.docs.title', 'Документация и Whitepaper')}</h2>
      <ul className="space-y-3 mb-8">
        <li><a href="/Token/whitepaper-ru.md" target="_blank" className="text-blue-600 hover:underline">{t('tokens.docs.whitepaperRu', 'Whitepaper (RU)')}</a></li>
        <li><a href="/Token/whitepaper-en.md" target="_blank" className="text-blue-600 hover:underline">{t('tokens.docs.whitepaperEn', 'Whitepaper (EN)')}</a></li>
        <li><a href="/Token/SECURITY_AUDIT_CHECKLIST.md" target="_blank" className="text-blue-600 hover:underline">{t('tokens.docs.audit', 'Security Audit Checklist')}</a></li>
        <li><a href="/Token/LapidaToken_BEP20_Deploy_Instructions.md" target="_blank" className="text-blue-600 hover:underline">{t('tokens.docs.deploy', 'Инструкция по деплою токена')}</a></li>
        <li><a href="/Token/LapidaToken_BEP20_Listing_Instructions.md" target="_blank" className="text-blue-600 hover:underline">{t('tokens.docs.listing', 'Инструкция по листингу токена')}</a></li>
      </ul>
    </div>
  );
};

export default TokensDocs;
