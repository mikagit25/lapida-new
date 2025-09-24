// Форма и отображение профиля религиозной организации
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import religiousOrgService from '../services/religiousOrgService';
import OrgHeroBlock from './OrgHeroBlock';
import OrgDescriptionBlock from './OrgDescriptionBlock';
import OrgGalleryBlock from './OrgGalleryBlock';
import OrgContactsBlock from './OrgContactsBlock';
import OrgFactsBlock from './OrgFactsBlock';

const initialProfile = {
  name: '',
  type: '',
  confession: '',
  description: '',
  contacts: {
    phone: '',
    email: '',
    website: '',
    address: ''
  },
  logo: '', // аватар
  background: '', // обои
  photos: [],
  documents: []
};


const ReligiousOrgProfile = ({ organizationId, isOwner = false }) => {
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const { t } = useTranslation();
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(true);
  // Получить isOwner из пропсов
  const [orgId, setOrgId] = useState(organizationId || null); // id организации, если уже создана
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Загрузка профиля организации (если есть)
  useEffect(() => {
    // Если organizationId есть, используем его для загрузки профиля
    if (organizationId) {
      setOrgId(organizationId);
    }
  }, [organizationId]);

  useEffect(() => {
    if (orgId) {
      setLoading(true);
      Promise.all([
        religiousOrgService.getById(orgId),
        import('../services/religiousGalleryService').then(({ default: religiousGalleryService }) => religiousGalleryService.getByOrganization(orgId))
      ])
        .then(([data, galleries]) => {
          setProfile(data);
          // Собрать все фото из альбомов
          const allPhotos = [];
          galleries.forEach(album => {
            if (album.photos && album.photos.length > 0) {
              album.photos.forEach(photoObj => {
                if (photoObj.url) allPhotos.push(photoObj.url);
              });
            }
          });
          setGalleryPhotos(allPhotos);
        })
        .catch(() => setError(t('religiousOrgProfile.loadError')))
        .finally(() => setLoading(false));
    }
  }, [orgId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('contacts.')) {
      setProfile({
        ...profile,
        contacts: { ...profile.contacts, [name.split('.')[1]]: value }
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let data;
      if (orgId) {
        data = await religiousOrgService.update(orgId, profile);
      } else {
        data = await religiousOrgService.create(profile);
        setOrgId(data._id);
      }
      setProfile(data);
      setEditMode(false);
    } catch (err) {
  setError(t('religiousOrgProfile.saveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {deleteLoading && <div>{t('common.loading')}</div>}
      {editMode ? (
        isOwner && (
          <form onSubmit={handleSubmit} className="profile-form bg-white rounded-xl shadow p-6 max-w-2xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">{t('religiousOrgProfile.title')}</h2>
            <input name="name" value={profile.name} onChange={handleChange} placeholder={t('religiousOrgProfile.name')} required className="mb-2 w-full px-3 py-2 rounded border" />
            <input name="type" value={profile.type} onChange={handleChange} placeholder={t('religiousOrgProfile.type')} className="mb-2 w-full px-3 py-2 rounded border" />
            <input name="confession" value={profile.confession} onChange={handleChange} placeholder={t('religiousOrgProfile.confession')} className="mb-2 w-full px-3 py-2 rounded border" />
            <textarea name="description" value={profile.description} onChange={handleChange} placeholder={t('religiousOrgProfile.description')} className="mb-2 w-full px-3 py-2 rounded border" />
            {/* Выбор аватара из галереи */}
            <div className="mb-2">
              <label className="block mb-1 font-medium">Выбрать аватар из галереи:</label>
              <select name="logo" value={profile.logo} onChange={handleChange} className="w-full px-3 py-2 rounded border">
                <option value="">-- не выбрано --</option>
                {galleryPhotos.map((src, idx) => (
                  <option key={idx} value={src}>{src}</option>
                ))}
              </select>
              {profile.logo && <img src={profile.logo} alt="avatar-preview" className="mt-2 w-24 h-24 object-cover rounded-full border" />}
            </div>
            {/* Выбор обоев из галереи */}
            <div className="mb-2">
              <label className="block mb-1 font-medium">Выбрать обои из галереи:</label>
              <select name="background" value={profile.background} onChange={handleChange} className="w-full px-3 py-2 rounded border">
                <option value="">-- не выбрано --</option>
                {galleryPhotos.map((src, idx) => (
                  <option key={idx} value={src}>{src}</option>
                ))}
              </select>
              {profile.background && <img src={profile.background} alt="background-preview" className="mt-2 w-full h-24 object-cover rounded border" />}
            </div>
            <input name="contacts.phone" value={profile.contacts.phone} onChange={handleChange} placeholder={t('religiousOrgProfile.phone')} className="mb-2 w-full px-3 py-2 rounded border" />
            <input name="contacts.email" value={profile.contacts.email} onChange={handleChange} placeholder={t('religiousOrgProfile.email')} className="mb-2 w-full px-3 py-2 rounded border" />
            <input name="contacts.website" value={profile.contacts.website} onChange={handleChange} placeholder={t('religiousOrgProfile.website')} className="mb-2 w-full px-3 py-2 rounded border" />
            <input name="contacts.address" value={profile.contacts.address} onChange={handleChange} placeholder={t('religiousOrgProfile.address')} className="mb-2 w-full px-3 py-2 rounded border" />
            {/* TODO: Загрузка фото, документов */}
            <button type="submit" disabled={loading} className="mt-4 px-6 py-2 bg-blue-700 text-white rounded shadow">{t('common.save')}</button>
          </form>
        )
      ) : (
        <>
          <OrgHeroBlock
            name={profile.name}
            description={profile.description}
            avatar={profile.logo}
            background={profile.background}
            address={profile.contacts.address}
            contacts={profile.contacts}
          />
          <OrgDescriptionBlock
            description={profile.description}
            mission={profile.mission}
            facts={profile.facts}
          />
          <OrgFactsBlock facts={profile.facts} />
          <OrgGalleryBlock photos={profile.photos} />
          <OrgContactsBlock contacts={profile.contacts} />
          {isOwner && (
            <div className="flex justify-center mt-4">
              <button onClick={() => setEditMode(true)} className="px-6 py-2 bg-blue-700 text-white rounded shadow">{t('common.edit')}</button>
              <button onClick={async () => {
                if (!orgId) return;
                if (!window.confirm(t('religiousOrgProfile.confirmDelete')))
                  return;
                setDeleteLoading(true);
                setError('');
                try {
                  await religiousOrgService.delete(orgId);
                  setProfile(initialProfile);
                  setOrgId(null);
                  alert(t('religiousOrgProfile.deleted'));
                } catch (err) {
                  setError(t('religiousOrgProfile.deleteError'));
                } finally {
                  setDeleteLoading(false);
                }
              }} className="px-6 py-2 bg-red-600 text-white rounded shadow">{t('common.delete')}</button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default ReligiousOrgProfile;
