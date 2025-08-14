import React, { useState } from 'react';

export default function GalleryManager({ gallery = [], isOwner, companyId, onGalleryChange }) {
  const [galleryImages, setGalleryImages] = React.useState(gallery);
  const [modalImg, setModalImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = React.useRef();

  React.useEffect(() => {
    setGalleryImages(gallery);
  }, [gallery]);

  function handleAddPhotoClick() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/companies/${companyId}/gallery`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        const updated = [...galleryImages, data.url];
        setGalleryImages(updated);
        onGalleryChange(updated);
      }
    } catch (err) {
      alert('Ошибка загрузки изображения');
    }
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDeleteImage(idx) {
    const token = localStorage.getItem('token');
    const imgUrl = galleryImages[idx];
    setLoading(true);
    try {
      const res = await fetch(`/api/companies/${companyId}/gallery`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ url: imgUrl }),
      });
      const data = await res.json();
      if (data.success) {
        const updated = galleryImages.filter((_, i) => i !== idx);
        setGalleryImages(updated);
        onGalleryChange(updated);
      }
    } catch (err) {
      alert('Ошибка удаления изображения');
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
        {galleryImages.length > 0 ? (
          galleryImages.map((img, idx) => (
            <div key={idx} className="relative group aspect-w-1 aspect-h-1">
              <img
                src={img}
                alt={`Галерея ${idx + 1}`}
                className="object-cover rounded-lg shadow cursor-pointer w-full h-full"
                onClick={() => setModalImg(img)}
              />
              {isOwner && (
                <button
                  className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                  title="Удалить"
                  onClick={e => { e.stopPropagation(); handleDeleteImage(idx); }}
                  disabled={loading}
                >✕</button>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 col-span-2 sm:col-span-3 text-center py-4">Нет изображений в галерее</div>
        )}
      </div>
      {isOwner && (
        <>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleAddPhotoClick}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Добавить фото'}
          </button>
        </>
      )}
      {modalImg && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" onClick={() => setModalImg(null)}>
          <img src={modalImg} alt="Просмотр" className="max-w-2xl max-h-[80vh] rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}
