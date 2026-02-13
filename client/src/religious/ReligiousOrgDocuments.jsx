import React, { useEffect, useState } from 'react';
import DocumentForm from './DocumentForm';
import DocumentListItem from './DocumentListItem';
import { useTranslation } from 'react-i18next';
import religiousDocumentService from '../services/religiousDocumentService';


function ReligiousOrgDocuments({ organizationId, isOwner }) {
  const { t } = useTranslation();
  const [docs, setDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const initialDoc = { title: '', description: '', publishedAt: '', fileUrl: '' };
  const [form, setForm] = useState(initialDoc);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    religiousDocumentService.getAll(organizationId)
      .then(res => setDocs(res.data))
      .catch(() => setError(t('religiousOrgDocuments.loadError')))
      .finally(() => setLoading(false));
  }, [organizationId, t]);

  if (selectedDoc) {
    return (
      <div className="document-detail">
        <button onClick={() => setSelectedDoc(null)}>← {t('common.backToList')}</button>
        <h2>{selectedDoc.title}</h2>
        <div><b>{t('religiousOrgDocuments.publishedAt')}:</b> {selectedDoc.publishedAt && new Date(selectedDoc.publishedAt).toLocaleString()}</div>
        <div style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>{selectedDoc.description}</div>
        <a href={selectedDoc.fileUrl} target="_blank" rel="noopener noreferrer" download>
          <button>{t('religiousOrgDocuments.downloadDoc')}</button>
        </a>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let doc;
      if (editId) {
        doc = { ...form, _id: editId };
        setDocs(docs.map(d => (d._id === editId ? doc : d)));
        setEditId(null);
      } else {
        doc = { ...form, _id: Date.now().toString() };
        setDocs([...docs, doc]);
      }
      setForm(initialDoc);
    } catch (err) {
      console.error('Ошибка сохранения документа релорганизации:', err);
      setError(t('religiousOrgDocuments.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    setForm(docs[idx]);
    setEditId(docs[idx]._id);
  };

  const handleDelete = (idx) => {
    try {
      setDocs(docs.filter((_, i) => i !== idx));
      if (editId === docs[idx]._id) setEditId(null);
    } catch (err) {
      console.error('Ошибка удаления документа релорганизации:', err);
    }
  };

  return (
    <div className="document-list">
      <h2>{t('religiousOrgDocuments.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && docs.length === 0 && <div>{t('religiousOrgDocuments.noDocs')}</div>}
      <DocumentForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        editId={editId}
        onCancel={() => { setForm(initialDoc); setEditId(null); }}
        isOwner={isOwner}
        t={t}
      />
      <ul>
        {docs.map((doc, idx) => (
          <DocumentListItem
            key={doc._id || idx}
            doc={doc}
            idx={idx}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            t={t}
            onSelect={setSelectedDoc}
          />
        ))}
      </ul>
    </div>
  );
}

export default ReligiousOrgDocuments;
