import React from 'react';

const OrgContactsBlock = ({ contacts }) => {
  if (!contacts) return null;
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Контакты</h2>
      <div className="flex flex-col gap-2 text-gray-700">
        {contacts.phone && <div>📞 {contacts.phone}</div>}
        {contacts.email && <div>✉️ {contacts.email}</div>}
        {contacts.website && <a href={contacts.website} target="_blank" rel="noopener noreferrer" className="underline">🌐 {contacts.website}</a>}
        {contacts.address && <div>🏠 {contacts.address}</div>}
      </div>
    </div>
  );
};

export default OrgContactsBlock;
