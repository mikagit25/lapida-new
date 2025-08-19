import React from 'react';
import CompanyNewsForm from './CompanyNewsForm';

function CompanyNewsBlock({
  news,
  setNews,
  onSave,
  loading,
  error,
  success
}) {
  return (
    <CompanyNewsForm
      news={news}
      setNews={setNews}
      onSave={onSave}
      loading={loading}
      error={error}
      success={success}
    />
  );
}

export default CompanyNewsBlock;
