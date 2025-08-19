import React from 'react';
import CompanyDocumentsForm from './CompanyDocumentsForm';

function CompanyDocumentsBlock({
  documents,
  setDocuments,
  onSave,
  loading,
  error,
  success
}) {
  return (
    <CompanyDocumentsForm
      documents={documents}
      setDocuments={setDocuments}
      onSave={onSave}
      loading={loading}
      error={error}
      success={success}
    />
  );
}

export default CompanyDocumentsBlock;
