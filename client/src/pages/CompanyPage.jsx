import { useCallback } from 'react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';

const CompanyPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { id } = useParams();
  const { user } = useAuth();
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/companies" className="text-blue-600 hover:underline mb-4 inline-block">← Назад к каталогу</Link>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-2">{company.name}</h1>
          <p className="text-gray-600 mb-2">{company.address}</p>
          <p className="text-gray-500 mb-2">ИНН: {company.inn}</p>
          <p className="mb-4">{company.description}</p>
          {/* Кнопка личного кабинета для владельца */}
          {user && company.owner === user.id && (
            <Link to={`/company-cabinet/${company._id}`} className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Личный кабинет компании</Link>
          )}
          <div className="mb-4">
            <span className={`px-2 py-1 rounded-full text-xs ${company.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{company.status === 'verified' ? 'Проверенная' : 'На проверке'}</span>
          </div>
          {company.gallery && company.gallery.length > 0 && (
            <div className="mb-4">
              <h2 className="font-semibold mb-2">Галерея</h2>
              <div className="flex gap-2 flex-wrap">
                {company.gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Фото компании"
                    className="w-24 h-24 object-cover rounded cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => openLightbox(idx)}
                  />
                ))}
              </div>
              {/* Lightbox modal */}
              {lightboxOpen && company.gallery.length > 0 && (
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
            </div>
          )}
          {company.products && company.products.length > 0 && (
            <div className="mb-4">
              <h2 className="font-semibold mb-2">Товары / услуги</h2>
              <ul className="list-disc pl-5">
                {company.products.map((prod, idx) => (
                  <li key={idx}>{prod.name} — {prod.price}₽</li>
                ))}
              </ul>
            </div>
          )}
          {company.documents && company.documents.length > 0 && (
            <div className="mb-4">
              <h2 className="font-semibold mb-2">Документы</h2>
              <ul className="list-disc pl-5">
                {company.documents.map((doc, idx) => (
                  <li key={idx}><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{doc.name}</a></li>
                ))}
              </ul>
            </div>
          )}
          {company.reviews && company.reviews.length > 0 && (
            <div className="mb-4">
              <h2 className="font-semibold mb-2">Отзывы</h2>
              <ul className="list-disc pl-5">
                {company.reviews.map((rev, idx) => (
                  <li key={idx}><span className="font-semibold">{rev.author}:</span> {rev.text}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
