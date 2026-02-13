import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import religiousOrgService from '../services/religiousOrgService';

const RegisterReligiousOrganization = () => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    confession: '',
    description: '',
    phone: '',
    email: '',
    website: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Привести контакты к объекту contacts
      const data = {
        name: form.name,
        type: form.type,
        confession: form.confession,
        description: form.description,
        contacts: {
          // Бэк ожидает массив телефонов с меткой
          phones: form.phone ? [{ label: 'Основной', value: form.phone }] : [],
          email: form.email || undefined,
          website: form.website || undefined,
          address: form.address
            ? {
                street: form.address,
              }
            : undefined,
        },
      };
      await religiousOrgService.create(data);
      setSuccess(true);
      setTimeout(() => navigate('/religious-organizations'), 1500);
    } catch (err) {
      console.error('Ошибка создания религиозной организации:', err);
      setError('Ошибка создания организации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Создать религиозную организацию</h1>
      {success ? (
        <div className="text-green-600 mb-4">Организация успешно создана! Перенаправление...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" placeholder="Название организации" />
          <input name="type" value={form.type} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Тип (церковь, приход...)" />
          <input name="confession" value={form.confession} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Конфессия" />
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Описание" />
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Телефон" />
          <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Email" />
          <input name="website" value={form.website} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Сайт" />
          <input name="address" value={form.address} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Адрес" />
          {error && <div className="text-red-600">{error}</div>}
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold">
            {loading ? 'Создание...' : 'Создать организацию'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterReligiousOrganization;
