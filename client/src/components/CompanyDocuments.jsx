import React from 'react';
export default function CompanyDocuments({ documents }) {
  if (!documents || documents.length === 0) return null;
  return (
    <div className="mb-8">
      <h2 className="font-semibold text-xl mb-2">Документы</h2>
      <ul>
        {documents.map(doc => (
          <li key={doc._id} className="mb-2">
            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{doc.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
