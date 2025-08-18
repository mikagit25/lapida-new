import React from "react";

// Галерея/список документов компании для просмотра
// props: documents (массив объектов { url, name, type })
const CompanyDocumentsViewer = ({ documents = [] }) => {
  if (!documents.length) {
    return <div>Нет документов для отображения.</div>;
  }

  return (
    <div className="company-documents-viewer">
      <h3>Документы компании</h3>
      <div className="documents-list" style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {documents.map((doc, idx) => (
          <div key={idx} className="document-item" style={{ width: "120px", textAlign: "center" }}>
            {doc.type && doc.type.startsWith("image") ? (
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                <img src={doc.url} alt={doc.name} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
              </a>
            ) : (
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                <div style={{ width: "100px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f3f3", borderRadius: "8px" }}>
                  <span role="img" aria-label="file" style={{ fontSize: "32px" }}>📄</span>
                </div>
              </a>
            )}
            <div style={{ marginTop: "8px", fontSize: "13px", wordBreak: "break-all" }}>{doc.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyDocumentsViewer;
