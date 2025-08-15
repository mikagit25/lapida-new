import React from 'react';
export default function CompanyContacts({ contacts, phones, emails }) {
  if (!contacts && (!phones || phones.length === 0) && (!emails || emails.length === 0)) return null;
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-xl mb-2">Контакты</h2>
      {/* Старый формат (один телефон/email) */}
      {contacts && contacts.phone && <div className="mb-2">Телефон: {contacts.phone}</div>}
      {contacts && contacts.email && <div className="mb-2">Email: {contacts.email}</div>}
      {/* Новый формат (массивы) */}
      {phones && phones.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold">Телефоны:</span>
          <ul className="list-disc ml-6">
            {phones.map((phone, idx) => (
              <li key={idx} className="flex items-center">
                <span className="mr-2">📞</span>{phone}
              </li>
            ))}
          </ul>
        </div>
      )}
      {emails && emails.length > 0 && (
        <div className="mb-2">
          <span className="font-semibold">Email:</span>
          <ul className="list-disc ml-6">
            {emails.map((email, idx) => (
              <li key={idx} className="flex items-center">
                <span className="mr-2">✉️</span>{email}
              </li>
            ))}
          </ul>
        </div>
      )}
      {contacts && contacts.map && (
        <div className="mb-2">
          <iframe src={contacts.map} title="Карта" width="100%" height="200" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
        </div>
      )}
    </div>
  );
}
