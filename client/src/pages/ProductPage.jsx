import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
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
    if (!product.images || product.images.length === 0) return;
    setLightboxIndex(i => (i + 1) % product.images.length);
  };
  const prevImage = () => {
    if (!product.images || product.images.length === 0) return;
    setLightboxIndex(i => (i - 1 + product.images.length) % product.images.length);
  };
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`http://localhost:5182/api/products/${slug}`);
      const data = await res.json();
      if (data.product) {
        setProduct(data.product);
      } else {
        setError('Товар не найден');
      }
    } catch (e) {
      setError('Ошибка загрузки товара');
    } finally {
      setLoading(false);
    }
  };

  // Универсальная логика заказа: добавить товар в корзину и перейти к оформлению
  const handleOrder = () => {
    if (!product) return;
    // Получить текущие товары из корзины
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    // Проверить, есть ли товар уже в корзине
    const exists = cartItems.find(item => item._id === product._id);
    if (exists) {
      exists.quantity = (exists.quantity || 1) + 1;
    } else {
      cartItems.push({ ...product, quantity: 1, companyId: product.companyId });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    // Перейти к оформлению заказа
    window.location.href = '/checkout';
  };

  // Lightbox галерея
  const showGallery = lightboxOpen && product.images && product.images.length > 0;

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!product) return <div className="p-8">Товар не найден</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {showGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
          <button className="absolute top-4 right-8 text-white text-3xl" onClick={closeLightbox}>&times;</button>
          <button className="absolute left-8 top-1/2 transform -translate-y-1/2 text-white text-3xl" onClick={prevImage}>&lt;</button>
          <img src={product.images[lightboxIndex]} alt="Фото" className="max-h-[80vh] max-w-[80vw] rounded shadow-lg" />
          <button className="absolute right-8 top-1/2 transform -translate-y-1/2 text-white text-3xl" onClick={nextImage}>&gt;</button>
        </div>
      )}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/companies" className="text-blue-600 hover:underline mb-4 inline-block">← К компаниям</Link>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Фото товара слева */}
            <div className="flex flex-col items-center md:items-start">
              {product.images && product.images.length > 0 && (
                <div className="mb-2 flex flex-col items-center">
                  {/* Большая фото */}
                  <img
                    src={product.images[lightboxIndex] || product.images[0]}
                    alt="Фото товара"
                    className="w-64 h-64 object-cover rounded shadow cursor-pointer mb-2"
                    onClick={() => openLightbox(lightboxIndex)}
                  />
                  {/* Миниатюры */}
                  <div className="flex gap-2 flex-wrap justify-center">
                    {product.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="Миниатюра"
                        className={`w-16 h-16 object-cover rounded shadow cursor-pointer border ${lightboxIndex === idx ? 'border-blue-500' : 'border-transparent'}`}
                        onClick={() => { setLightboxIndex(idx); openLightbox(idx); }}
                      />
                    ))}
                  </div>
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
        {/* QR-код и URL внизу страницы */}
        <div className="mt-8 flex flex-col items-center">
          <QRCode value={`https://lapida.one/product/${product.slug || slug}`} size={128} />
          <div className="text-xs text-gray-500 mt-2">QR-код для быстрой передачи ссылки на товар</div>
          <div className="mt-2 text-sm text-gray-700 font-mono break-all">https://lapida.one/product/{product.slug || slug}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
