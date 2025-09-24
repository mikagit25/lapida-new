import React from 'react';

const OrganizationContacts = ({ contacts }) => {
  if (!contacts) return null;
  return (
    <div className="flex flex-col gap-1 text-gray-700">
      {contacts.phone && <div><b>Телефон:</b> {contacts.phone}</div>}
      {contacts.email && <div><b>Email:</b> {contacts.email}</div>}
      {contacts.website && <div><b>Сайт:</b> <a href={contacts.website} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{contacts.website}</a></div>}
      {contacts.address && <div><b>Адрес:</b> {contacts.address}</div>}
    </div>
  );
};

export default OrganizationContacts;
