import React from 'react';

const OrganizationDescription = ({ description }) => {
  if (!description) return null;
  return (
    <div className="text-gray-700 whitespace-pre-line">{description}</div>
  );
};

export default OrganizationDescription;
