import React, { useRef } from 'react';

function getFileType(url) {
  if (!url) return 'unknown';
  const ext = url.split('.').pop().toLowerCase();
  if (["jpg","jpeg","png","gif","bmp","webp"].includes(ext)) return 'image';
  if (["pdf"].includes(ext)) return 'pdf';
  if (["doc","docx"].includes(ext)) return 'doc';
  if (["txt"].includes(ext)) return 'txt';
  return 'file';
}

// Галерея документов
function DocumentsGallery({ documents }) {
  if (!documents || !documents.length) return null;
  return (
    <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {documents.map((doc, idx) => {
        const url = doc.url || doc;
        const type = doc.type || getFileType(url);
        return (
          <div key={idx} className="border rounded p-2 flex flex-col items-center">
            {type === 'image' ? (
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img src={url} alt={doc.name || 'Документ'} className="w-24 h-24 object-cover rounded border mb-2" />
              </a>
            ) : (
              <a href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
                {type === 'pdf' && <span className="text-red-600 text-3xl">📄</span>}
                {type === 'doc' && <span className="text-blue-600 text-3xl">📃</span>}
                {type === 'txt' && <span className="text-gray-600 text-3xl">📑</span>}
                {type === 'file' && <span className="text-gray-400 text-3xl">📁</span>}
                <span className="underline text-xs mt-1">{doc.name || 'Документ'}</span>
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CompanyDocumentsForm({ documents, setDocuments, onSave, loading, error, success }) {
  const fileInputRef = useRef();
  const docsArr = Array.isArray(documents) ? documents : [];
  const [uploading, setUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState(null);

  // Загрузить файл и сохранить в компанию
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleUploadAndSave = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError('');
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const res = await fetch('/api/companies/upload-document', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.url) {
        const ext = selectedFile.name.split('.').pop().toLowerCase();
        let type = 'file';
        if (["jpg","jpeg","png","gif","bmp","webp"].includes(ext)) type = 'image';
        else if (["pdf"].includes(ext)) type = 'pdf';
        else if (["doc","docx"].includes(ext)) type = 'doc';
        else if (["txt"].includes(ext)) type = 'txt';
        const newDoc = { url: data.url, name: selectedFile.name, type };
        const updatedDocs = [...docsArr, newDoc];
        setDocuments(updatedDocs);
        if (onSave) await onSave(updatedDocs);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setUploadError('Ошибка загрузки файла');
      }
    } catch (err) {
      console.error('Ошибка загрузки файла', err);
      setUploadError('Ошибка загрузки файла');
    }
    setUploading(false);
  };

  // Добавить документ (пустое поле)
  // eslint-disable-next-line no-unused-vars
  const handleAddDocument = () => {
    setDocuments([...documents, '']);
  };

  // Изменить документ
  const handleChange = (idx, value) => {
    const updated = [...documents];
    updated[idx] = value;
    setDocuments(updated);
  };

  // Удалить документ
  const handleDelete = idx => {
    const updated = [...documents];
    updated.splice(idx, 1);
    setDocuments(updated);
  };

  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Документы компании</h2>
      {/* Галерея документов */}
      <DocumentsGallery documents={docsArr} />
      {uploading && <div className="text-blue-600 mb-2">Загрузка документа...</div>}
      {uploadError && <div className="text-red-600 mb-2">{uploadError}</div>}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'block', marginBottom: '12px' }}
        accept="image/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <button
        type="button"
        className="bg-blue-600 text-white px-4 py-2 rounded font-semibold mb-4"
        onClick={handleUploadAndSave}
        disabled={uploading || !selectedFile}
      >
        Загрузить и сохранить документ
      </button>
      {docsArr.map((doc, idx) => {
        // doc теперь объект { url, name, type }
        // const type = doc.type || getFileType(doc.url || doc);
        return (
          <div key={idx} className="mb-4 border rounded p-3 flex items-center gap-2">
            <input
              type="text"
              className="border px-3 py-2 rounded w-full"
              value={doc.url || doc}
              onChange={e => handleChange(idx, e.target.value)}
              placeholder="Ссылка на документ или описание"
            />
            <span className="text-xs text-gray-500 ml-2">{doc.name || ''}</span>
            <button type="button" className="text-xs text-red-600" onClick={() => handleDelete(idx)}>Удалить</button>
          </div>
        );
      })}
      <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" disabled={loading || uploading} onClick={() => onSave(docsArr)}>
        {loading ? 'Сохранение...' : 'Сохранить документы'}
      </button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
    </div>
  );
}
