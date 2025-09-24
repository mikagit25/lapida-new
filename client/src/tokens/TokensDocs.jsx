import React from 'react';

const TokensDocs = () => (
  <div className="max-w-xl mx-auto py-12 px-4">
    <h2 className="text-2xl font-bold mb-4">Документация и Whitepaper</h2>
    <ul className="space-y-3 mb-8">
      <li><a href="/tokens/docs/whitepaper-ru.md" target="_blank" className="text-blue-600 hover:underline">Whitepaper (RU)</a></li>
      <li><a href="/tokens/docs/whitepaper-en.md" target="_blank" className="text-blue-600 hover:underline">Whitepaper (EN)</a></li>
      <li><a href="/tokens/docs/SECURITY_AUDIT_CHECKLIST.md" target="_blank" className="text-blue-600 hover:underline">Security Audit Checklist</a></li>
      <li><a href="/Токен/LapidaToken_BEP20_Deploy_Instructions.md" target="_blank" className="text-blue-600 hover:underline">Инструкция по деплою токена</a></li>
      <li><a href="/Токен/LapidaToken_BEP20_Listing_Instructions.md" target="_blank" className="text-blue-600 hover:underline">Инструкция по листингу токена</a></li>
    </ul>
  </div>
);

export default TokensDocs;
