// Компонент галереи церкви (фотоальбомы)
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import religiousGalleryService from '../services/religiousGalleryService';
import GalleryForm from './GalleryForm';
import GalleryListItem from './GalleryListItem';


const initialAlbum = { title: '', description: '', photos: [] };

const ReligiousOrgGallery = ({ orgId, isOwner }) => {
  const { t } = useTranslation();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(initialAlbum);
  const [editId, setEditId] = useState(null);
  const [photoFiles, setPhotoFiles] = useState([]);

  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    religiousGalleryService.getByOrganization(orgId)
      .then(setGalleries)
  .catch(() => setError(t('religiousOrgGallery.loadError')))
      .finally(() => setLoading(false));
  }, [orgId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    setPhotoFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let album;
      // TODO: реализовать загрузку файлов на сервер и получение url
      const photos = photoFiles.map(f => ({ url: URL.createObjectURL(f), caption: f.name }));
      if (editId) {
        album = await religiousGalleryService.update(editId, { ...form, organization: orgId, photos });
        setGalleries(galleries.map(g => (g._id === editId ? album : g)));
        setEditId(null);
      } else {
        album = await religiousGalleryService.create({ ...form, organization: orgId, photos });
        setGalleries([...galleries, album]);
      }
      setForm(initialAlbum);
      setPhotoFiles([]);
    } catch (err) {
  setError(t('religiousOrgGallery.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (album) => {
    setForm({ title: album.title, description: album.description, photos: album.photos });
    setEditId(album._id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    setError('');
    try {
      await religiousGalleryService.remove(id);
      setGalleries(galleries.filter(g => g._id !== id));
      if (editId === id) setEditId(null);
    } catch (err) {
  setError(t('religiousOrgGallery.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>{t('religiousOrgGallery.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <GalleryForm
        form={form}
        onChange={handleChange}
        onPhotoChange={handlePhotoChange}
        onSubmit={handleSubmit}
        loading={loading}
        editId={editId}
        onCancel={() => { setForm(initialAlbum); setEditId(null); setPhotoFiles([]); }}
        isOwner={isOwner}
        t={t}
      />
      <ul className="gallery-list">
        {galleries.map((album, idx) => (
          <GalleryListItem
            key={album._id || idx}
            album={album}
            idx={idx}
            isOwner={isOwner}
            onEdit={() => handleEdit(album)}
            onDelete={() => handleDelete(album._id)}
            t={t}
          />
        ))}
      </ul>
    </section>
  );
};

export default ReligiousOrgGallery;
