import React, { useEffect, useState } from 'react';
import NewsForm from './NewsForm';
import NewsListItem from './NewsListItem';
import { useTranslation } from 'react-i18next';
import religiousNewsService from '../services/religiousNewsService';


function ReligiousOrgNews({ organizationId, isOwner }) {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    religiousNewsService.getAll(organizationId)
      .then(res => setNews(res.data))
      .catch(() => setError(t('religiousOrgNews.loadError')))
      .finally(() => setLoading(false));
  }, [organizationId, t]);

  if (selectedNews) {
    return (
      <div className="news-detail">
        <button onClick={() => setSelectedNews(null)}>← {t('common.backToList')}</button>
        <h2>{selectedNews.title}</h2>
        <div><b>{t('religiousOrgNews.publishedAt')}:</b> {selectedNews.publishedAt && new Date(selectedNews.publishedAt).toLocaleString()}</div>
        <div style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>{selectedNews.text}</div>
        {selectedNews.images && selectedNews.images.length > 0 && (
          <div className="news-images">
            <b>{t('religiousOrgNews.images')}:</b>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedNews.images.map((img, i) => (
                <img key={i} src={img} alt="news" style={{ maxWidth: 200, margin: 4 }} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const initialNews = { title: '', text: '', publishedAt: '', images: [] };
  const [form, setForm] = useState(initialNews);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let nw;
      if (editId) {
        nw = { ...form, _id: editId };
        setNews(news.map(n => (n._id === editId ? nw : n)));
        setEditId(null);
      } else {
        nw = { ...form, _id: Date.now().toString() };
        setNews([...news, nw]);
      }
      setForm(initialNews);
    } catch (err) {
      setError(t('religiousOrgNews.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    setForm(news[idx]);
    setEditId(news[idx]._id);
  };

  const handleDelete = (idx) => {
    setNews(news.filter((_, i) => i !== idx));
    if (editId === news[idx]._id) setEditId(null);
  };

  return (
    <div className="news-list">
      <h2>{t('religiousOrgNews.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && news.length === 0 && <div>{t('religiousOrgNews.noNews')}</div>}
      <NewsForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        editId={editId}
        onCancel={() => { setForm(initialNews); setEditId(null); }}
        isOwner={isOwner}
        t={t}
      />
      <ul>
        {news.map((nw, idx) => (
          <NewsListItem
            key={nw._id || idx}
            news={nw}
            idx={idx}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            t={t}
            onSelect={setSelectedNews}
          />
        ))}
      </ul>
    </div>
  );
}

export default ReligiousOrgNews;
