// Управление услугами религиозной организации
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import religiousServiceService from '../services/religiousServiceService';
import ServiceForm from './ServiceForm';
import ServiceListItem from './ServiceListItem';

const initialService = { name: '', description: '', price: '', available: true };


const ReligiousOrgServices = ({ orgId, isOwner }) => {
  const { t } = useTranslation();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialService);
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загрузка услуг при монтировании
  useEffect(() => {
    if (!orgId) return;
    setLoading(true);
    religiousServiceService.getByOrganization(orgId)
      .then(setServices)
  .catch(() => setError(t('religiousOrgServices.loadError')))
      .finally(() => setLoading(false));
  }, [orgId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  setError('');
    try {
      let newService;
      if (editId) {
        newService = await religiousServiceService.update(editId, { ...form, organization: orgId });
        setServices(services.map(s => (s._id === editId ? newService : s)));
        setEditId(null);
        setEditIndex(null);
      } else {
        newService = await religiousServiceService.create({ ...form, organization: orgId });
        setServices([...services, newService]);
      }
      setForm(initialService);
    } catch (err) {
  setError(t('religiousOrgServices.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    setForm(services[idx]);
    setEditIndex(idx);
    setEditId(services[idx]._id);
  };

  const handleDelete = async (idx) => {
    const id = services[idx]._id;
    setLoading(true);
    setError('');
    try {
      await religiousServiceService.remove(id);
      setServices(services.filter((s, i) => i !== idx));
    } catch {
      setError(t('religiousOrgServices.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  // ...existing code...

  return (
    <section>
      <h2>{t('religiousOrgServices.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ServiceForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        editIndex={editIndex}
        onCancel={() => { setEditId(null); setForm(initialService); setEditIndex(null); }}
        isOwner={isOwner}
        t={t}
      />
      <ul>
        {services.map((service, idx) => (
          <ServiceListItem
            key={service._id || idx}
            service={service}
            idx={idx}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            t={t}
          />
        ))}
      </ul>
    </section>
  );
};

export default ReligiousOrgServices;
