import React, { useEffect, useState } from 'react';
import ContactForm from './ContactForm';
import ContactListItem from './ContactListItem';
import { useTranslation } from 'react-i18next';
import religiousContactService from '../services/religiousContactService';

const ICONS = {
  phone: '📞',
  email: '✉️',
  address: '📍',
  site: '🌐',
  social: '🔗',
};

function ReligiousOrgContacts({ organizationId, isOwner }) {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    religiousContactService.getAll(organizationId)
      .then(res => setContacts(res.data))
      .catch(() => setError(t('religiousOrgContacts.loadError')))
      .finally(() => setLoading(false));
  }, [organizationId, t]);

  // Try to find address for map
  const address = contacts.find(c => c.type === 'address')?.value;

  const initialContact = { type: '', value: '' };
  const [form, setForm] = useState(initialContact);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let contact;
      if (editId) {
        contact = { ...form, _id: editId };
        setContacts(contacts.map(c => (c._id === editId ? contact : c)));
        setEditId(null);
      } else {
        contact = { ...form, _id: Date.now().toString(), icon: ICONS[form.type] || '🔗' };
        setContacts([...contacts, contact]);
      }
      setForm(initialContact);
    } catch (err) {
      console.error('Ошибка сохранения контактов релорганизации:', err);
      setError(t('religiousOrgContacts.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    setForm(contacts[idx]);
    setEditId(contacts[idx]._id);
  };

  const handleDelete = (idx) => {
    setContacts(contacts.filter((_, i) => i !== idx));
    if (editId === contacts[idx]._id) setEditId(null);
  };

  return (
    <div className="contacts-list">
      <h2>{t('religiousOrgContacts.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && contacts.length === 0 && <div>{t('religiousOrgContacts.noContacts')}</div>}
      <ContactForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        editId={editId}
        onCancel={() => { setForm(initialContact); setEditId(null); }}
        isOwner={isOwner}
        t={t}
      />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {contacts.map((c, idx) => (
          <ContactListItem
            key={c._id || idx}
            contact={c}
            idx={idx}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            t={t}
          />
        ))}
      </ul>
      {address && (
        <div style={{ marginTop: 24 }}>
          <h3>{t('religiousOrgContacts.mapTitle')}</h3>
          <iframe
            title="map"
            width="100%"
            height="300"
            frameBorder="0"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`}
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

export default ReligiousOrgContacts;
