import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductPage = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const openLightbox = (idx = 0) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const nextImage = () => {
    if (!product.gallery || product.gallery.length === 0) return;
    setLightboxIndex(i => (i + 1) % product.gallery.length);
  };
  const prevImage = () => {
    if (!product.gallery || product.gallery.length === 0) return;
    setLightboxIndex(i => (i - 1 + product.gallery.length) % product.gallery.length);
  };
  const { companyId, productId } = useParams();
  const [product, setProduct] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [companyId, productId]);

  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/companies/${companyId}`);
      const data = await res.json();
      setCompany(data.company || null);
      if (data.company && data.company.products) {
        const prod = data.company.products.find(p => p._id === productId);
        setProduct(prod || null);
      }
    } catch (e) {
      setError('Ошибка загрузки товара');
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => setOrderSuccess(false), 2000);
  };

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return <div className="p-8">Товар не найден</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to={`/companies/${companyId}`} className="text-blue-600 hover:underline mb-4 inline-block">← Назад к компании</Link>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Фото товара слева */}
            <div className="flex flex-col items-center md:items-start">
              {product.gallery && product.gallery.length > 0 && (
                <div className="mb-2 flex gap-2 flex-wrap">
                  {product.gallery.map((img, idx) => (
                    <img key={idx} src={img} alt="Фото товара" className="w-32 h-32 object-cover rounded shadow cursor-pointer" onClick={() => openLightbox(idx)} />
                  ))}
                </div>
              )}
              {/* Lightbox для фото товара */}
              {lightboxOpen && product.gallery && product.gallery.length > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
                  <button className="absolute top-4 right-8 text-white text-3xl" onClick={closeLightbox}>×</button>
                  <button className="absolute left-8 text-white text-3xl" onClick={prevImage}>&lt;</button>
                  <div className="flex flex-col items-center">
                    <img src={product.gallery[lightboxIndex]} alt="Фото товара" className="max-h-[70vh] max-w-[80vw] rounded shadow-lg" />
                    <div className="flex gap-2 mt-4">
                      {product.gallery.map((img, i) => (
                        <img key={i} src={img} alt="" className={`w-16 h-16 object-cover rounded cursor-pointer ${i === lightboxIndex ? 'ring-2 ring-blue-500' : ''}`} onClick={() => setLightboxIndex(i)} />
                      ))}
                    </div>
                  </div>
                  <button className="absolute right-8 text-white text-3xl" onClick={nextImage}>&gt;</button>
                </div>
              )}
            </div>
            {/* Название и цена справа */}
            <div className="flex flex-col justify-center flex-1">
              <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
              <p className="mb-2 text-lg font-semibold">Цена: {product.price}₽</p>
              <button onClick={handleOrder} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold mt-2 w-fit">
                Заказать
              </button>
              {orderSuccess && <div className="mt-2 text-green-600">Заявка отправлена!</div>}
            </div>
          </div>
          {/* Описание ниже фото и названия */}
          <div className="mt-6">
            <p className="mb-2 text-gray-700">{product.description}</p>
            <p className="mb-2 text-gray-500">Категория: {product.category}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
