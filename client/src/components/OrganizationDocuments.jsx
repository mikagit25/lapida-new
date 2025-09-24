import React from 'react';

const OrganizationDocuments = ({ documents }) => {
  if (!documents || documents.length === 0) return null;
  return (
    <ul className="list-disc pl-6 text-gray-700 space-y-1">
      {documents.map((doc, i) => (
        <li key={i}>
          <a href={doc} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
            Документ {i + 1}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default OrganizationDocuments;
