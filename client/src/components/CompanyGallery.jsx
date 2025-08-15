import React, { useState } from 'react';

// Вспомогательная функция удаления фото
async function deleteCompanyPhoto(companyId, imgUrl) {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  const res = await fetch(`/api/companies/${companyId}/gallery`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ url: imgUrl }),
  });
  if (!res.ok) throw new Error('Ошибка удаления');
  const data = await res.json();
  return data.gallery || [];
}

export default function CompanyGallery({ images, companyId, isOwner }) {
  const [galleryImages, setGalleryImages] = useState(images || []);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  React.useEffect(() => {
    setGalleryImages(images || []);
  }, [images]);

  const openLightbox = idx => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImage = () => setLightboxIndex(i => (i - 1 + galleryImages.length) % galleryImages.length);
  const nextImage = () => setLightboxIndex(i => (i + 1) % galleryImages.length);

  const handleDelete = async (imgUrl) => {
    if (!window.confirm('Удалить это фото?')) return;
    setDeleting(true);
    try {
      const updated = await deleteCompanyPhoto(companyId, imgUrl);
      setGalleryImages(updated);
    } catch (e) {
      alert('Ошибка удаления');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="overflow-x-auto py-2">
        <div className="flex gap-4" style={{ minWidth: 'max-content' }}>
          {galleryImages.map((img, idx) => (
            <div key={idx} className="relative group flex-shrink-0">
              <img
                src={img}
                alt={`Фото ${idx + 1}`}
                className="w-32 h-32 object-cover rounded shadow cursor-pointer"
                onClick={() => openLightbox(idx)}
              />
              {isOwner && (
                <button
                  type="button"
                  className="absolute top-1 right-1 z-10 text-red-600 text-xl font-bold px-1 py-0.5 bg-transparent border-none shadow-none hover:text-red-800"
                  title="Удалить фото"
                  style={{ lineHeight: '1', minWidth: 'unset', minHeight: 'unset' }}
                  onClick={e => { e.stopPropagation(); handleDelete(img); }}
                  disabled={deleting}
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <button className="absolute top-4 right-4 text-white text-3xl" onClick={closeLightbox} title="Закрыть">×</button>
          <button className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl" onClick={prevImage} title="Предыдущее">‹</button>
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl" onClick={nextImage} title="Следующее">›</button>
          <div className="relative max-w-3xl w-full mx-auto bg-white rounded-lg shadow-lg p-6 z-10 flex flex-col items-center">
            <img src={galleryImages[lightboxIndex]} alt={`Фото ${lightboxIndex + 1}`} className="max-h-[80vh] w-auto object-contain rounded mb-4" />
            <div className="text-center text-gray-700 mt-2">{`Фото ${lightboxIndex + 1} из ${galleryImages.length}`}</div>
          </div>
        </div>
      )}
    </>
  );
}
