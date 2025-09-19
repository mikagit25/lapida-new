// Форма и отображение профиля религиозной организации
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import religiousOrgService from '../services/religiousOrgService';

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
  logo: '',
  photos: [],
  documents: []
};


const ReligiousOrgProfile = ({ organizationId }) => {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(true);
  const [orgId, setOrgId] = useState(organizationId || null); // id организации, если уже создана
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      religiousOrgService.getById(orgId)
        .then(data => setProfile(data))
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
      <h2>{t('religiousOrgProfile.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {editMode ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <input name="name" value={profile.name} onChange={handleChange} placeholder={t('religiousOrgProfile.name')} required />
          <input name="type" value={profile.type} onChange={handleChange} placeholder={t('religiousOrgProfile.type')} />
          <input name="confession" value={profile.confession} onChange={handleChange} placeholder={t('religiousOrgProfile.confession')} />
          <textarea name="description" value={profile.description} onChange={handleChange} placeholder={t('religiousOrgProfile.description')} />
          <input name="contacts.phone" value={profile.contacts.phone} onChange={handleChange} placeholder={t('religiousOrgProfile.phone')} />
          <input name="contacts.email" value={profile.contacts.email} onChange={handleChange} placeholder={t('religiousOrgProfile.email')} />
          <input name="contacts.website" value={profile.contacts.website} onChange={handleChange} placeholder={t('religiousOrgProfile.website')} />
          <input name="contacts.address" value={profile.contacts.address} onChange={handleChange} placeholder={t('religiousOrgProfile.address')} />
          {/* TODO: Загрузка логотипа, фото, документов */}
          <button type="submit" disabled={loading}>{t('common.save')}</button>
        </form>
      ) : (
        <div className="profile-view">
          <h3>{profile.name}</h3>
          <div>{profile.type} | {profile.confession}</div>
          <div>{profile.description}</div>
          <div>{t('religiousOrgProfile.phone')}: {profile.contacts.phone}</div>
          <div>{t('religiousOrgProfile.email')}: {profile.contacts.email}</div>
          <div>{t('religiousOrgProfile.website')}: {profile.contacts.website}</div>
          <div>{t('religiousOrgProfile.address')}: {profile.contacts.address}</div>
          {/* TODO: Отображение логотипа, фото, документов */}
          <button onClick={() => setEditMode(true)}>{t('common.edit')}</button>
        </div>
      )}
    </section>
  );
};

export default ReligiousOrgProfile;
