import { useCallback } from 'react';
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const TABS = [
  { key: 'info', label: 'Данные компании' },
  { key: 'gallery', label: 'Галерея' },
  { key: 'products', label: 'Товары/услуги' },
  { key: 'documents', label: 'Документы' },
  { key: 'reviews', label: 'Отзывы' },
];

function AddProductForm({ companyId, onAdd }) {
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/companies/${companyId}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.products) {
        setSuccess(true);
        setForm({ name: '', description: '', price: '', category: '' });
        if (onAdd) onAdd();
      } else {
        setError(data.message || 'Ошибка добавления');
      }
    } catch (e) {
      setError('Ошибка добавления');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4 flex flex-col gap-2">
      <input name="name" value={form.name} onChange={handleChange} placeholder="Название" required className="border px-3 py-2 rounded" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="Цена" type="number" min="0" className="border px-3 py-2 rounded" />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Категория" className="border px-3 py-2 rounded" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" className="border px-3 py-2 rounded" />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Товар добавлен!</div>}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
        {loading ? 'Добавление...' : 'Добавить товар/услугу'}
      </button>
    </form>
  );
}

function AddDocumentForm({ companyId, onAdd }) {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`/api/companies/${companyId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.documents) {
        setSuccess(true);
        setUrl('');
        setName('');
        if (onAdd) onAdd();
      } else {
        setError(data.message || 'Ошибка загрузки');
      }
    } catch (e) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4 flex flex-col gap-2">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Название документа" className="border px-3 py-2 rounded" />
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Ссылка на документ (URL)" required className="border px-3 py-2 rounded" />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Документ добавлен!</div>}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
        {loading ? 'Загрузка...' : 'Добавить документ'}
      </button>
    </form>
  );
}

function AddGalleryPhotoForm({ companyId, onAdd }) {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      let res, data;
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        const token = localStorage.getItem('authToken');
        res = await fetch(`/api/companies/${companyId}/gallery`, {
          method: 'POST',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          body: formData,
          credentials: 'include'
        });
      } else if (url) {
        res = await fetch(`/api/companies/${companyId}/gallery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('authToken') ? { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` } : {})
          },
          body: JSON.stringify({ url }),
          credentials: 'include'
        });
      } else {
        setError('Выберите файл или введите URL');
        setLoading(false);
        return;
      }
      data = await res.json();
      if (data.gallery) {
        setSuccess(true);
        setUrl('');
        setFile(null);
        if (onAdd) onAdd();
      } else {
        setError(data.message || 'Ошибка загрузки');
      }
    } catch (e) {
      setError('Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4 flex flex-col gap-2">
      <label className="font-medium">Загрузить фото (файл):</label>
      <input type="file" accept="image/*" onChange={handleFileChange} className="border px-3 py-2 rounded" />
      <span className="text-xs text-gray-500">или</span>
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Ссылка на фото (URL)" className="border px-3 py-2 rounded" />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Фото добавлено!</div>}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
        {loading ? 'Загрузка...' : 'Добавить фото'}
      </button>
    </form>
  );
}

function AddReviewForm({ companyId, onAdd }) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`/api/companies/${companyId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, rating }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.reviews) {
        setSuccess(true);
        setText('');
        setRating(5);
        if (onAdd) onAdd();
      } else {
        setError(data.message || 'Ошибка добавления');
      }
    } catch (e) {
      setError('Ошибка добавления');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded mb-4 flex flex-col gap-2">
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Ваш отзыв" required className="border px-3 py-2 rounded" />
      <label className="text-sm font-medium">Оценка:
        <select value={rating} onChange={e => setRating(Number(e.target.value))} className="ml-2 border rounded px-2 py-1">
          {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">Отзыв добавлен!</div>}
      <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
        {loading ? 'Добавление...' : 'Добавить отзыв'}
      </button>
    </form>
  );
}

const CompanyCabinet = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  // useCallback, которые используют company, объявляем после company
  const openLightbox = useCallback(idx => {
    if (!company || !company.gallery) return;
    setLightboxIndex(idx);
    setLightboxOpen(true);
  }, [company]);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const nextImage = useCallback(() => {
    if (!company || !company.gallery || company.gallery.length === 0) return;
    setLightboxIndex(i => (i + 1) % company.gallery.length);
  }, [company]);
  const prevImage = useCallback(() => {
    if (!company || !company.gallery || company.gallery.length === 0) return;
    setLightboxIndex(i => (i - 1 + company.gallery.length) % company.gallery.length);
  }, [company]);
  const [tab, setTab] = useState('info');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/companies/${id}`);
      const data = await res.json();
      setCompany(data.company || null);
    } catch (e) {
      setError('Ошибка загрузки компании');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!company) return <div className="p-8">Компания не найдена</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-2 items-center">
          <Link to={`/companies/${company._id}`} className="text-blue-600 hover:underline">← Назад к компании</Link>
          <span className="text-gray-400">|</span>
          <span className="font-bold">Личный кабинет компании</span>
        </div>
        <div className="mb-6 flex gap-4 border-b pb-2">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-t font-semibold ${tab === t.key ? 'bg-white shadow text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {tab === 'info' && (
            <div>
              <h2 className="text-xl font-bold mb-2">{company.name}</h2>
              <p className="mb-2">ИНН: {company.inn}</p>
              <p className="mb-2">Адрес: {company.address}</p>
              <p className="mb-2">Статус: <span className={`px-2 py-1 rounded-full text-xs ${company.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{company.status === 'verified' ? 'Проверена' : 'На проверке'}</span></p>
              <p className="mb-2">Описание: {company.description}</p>
              <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Редактировать данные</button>
            </div>
          )}
          {tab === 'gallery' && (
            <div>
              <h2 className="font-semibold mb-2">Галерея компании</h2>
              <div className="flex gap-2 flex-wrap mb-4">
                {company.gallery && company.gallery.length > 0 ? company.gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Фото компании"
                    className="w-24 h-24 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => openLightbox(idx)}
                  />
                )) : <div>Нет фото</div>}
              </div>
              {/* Lightbox modal */}
              {lightboxOpen && company.gallery && company.gallery.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={closeLightbox}>
                  <div className="relative" onClick={e => e.stopPropagation()}>
                    <img src={company.gallery[lightboxIndex]} alt="Фото компании" className="max-w-[90vw] max-h-[80vh] rounded shadow-lg" />
                    <button onClick={closeLightbox} className="absolute top-2 right-2 bg-gray-800 text-white rounded-full px-3 py-1 text-lg">×</button>
                    {company.gallery.length > 1 && (
                      <>
                        <button onClick={prevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-full px-3 py-1 text-lg">‹</button>
                        <button onClick={nextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white rounded-full px-3 py-1 text-lg">›</button>
                      </>
                    )}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white text-xs bg-black bg-opacity-40 px-2 py-1 rounded">{lightboxIndex + 1} / {company.gallery.length}</div>
                  </div>
                </div>
              )}
              <AddGalleryPhotoForm companyId={company._id} onAdd={fetchCompany} />
            </div>
          )}
          {tab === 'products' && (
            <div>
              <h2 className="font-semibold mb-2">Товары / услуги</h2>
              <ul className="list-disc pl-5 mb-4">
                {company.products && company.products.length > 0 ? company.products.map((prod, idx) => (
                  <li key={prod._id}>
                    <Link to={`/companies/${company._id}/products/${prod._id}`} className="text-blue-600 hover:underline font-semibold">
                      {prod.name}
                    </Link>
                    {' '}— {prod.price}₽
                  </li>
                )) : <div>Нет товаров/услуг</div>}
              </ul>
              <AddProductForm companyId={company._id} onAdd={fetchCompany} />
            </div>
          )}
          {tab === 'documents' && (
            <div>
              <h2 className="font-semibold mb-2">Документы</h2>
              <ul className="list-disc pl-5 mb-4">
                {company.documents && company.documents.length > 0 ? company.documents.map((doc, idx) => (
                  <li key={idx}><a href={doc} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Документ {idx + 1}</a></li>
                )) : <div>Нет документов</div>}
              </ul>
              <AddDocumentForm companyId={company._id} onAdd={fetchCompany} />
            </div>
          )}
          {tab === 'reviews' && (
            <div>
              <h2 className="font-semibold mb-2">Отзывы</h2>
              <ul className="list-disc pl-5 mb-4">
                {company.reviews && company.reviews.length > 0 ? company.reviews.map((rev, idx) => (
                  <li key={idx}><span className="font-semibold">{rev.author}:</span> {rev.text} <span className="text-yellow-500">★ {rev.rating}</span></li>
                )) : <div>Нет отзывов</div>}
              </ul>
              <AddReviewForm companyId={company._id} onAdd={fetchCompany} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyCabinet;
