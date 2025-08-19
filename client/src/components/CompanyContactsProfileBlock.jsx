import React from 'react';
import CompanyContacts from './CompanyContacts';

function CompanyContactsProfileBlock({ contacts, phones, emails }) {
  return <CompanyContacts contacts={contacts} phones={phones} emails={emails} />;
}

export default CompanyContactsProfileBlock;
