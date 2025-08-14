import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductPage = () => {
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
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="mb-2 text-gray-700">{product.description}</p>
          <p className="mb-2 text-gray-500">Категория: {product.category}</p>
          <p className="mb-2 text-lg font-semibold">Цена: {product.price}₽</p>
          {product.gallery && product.gallery.length > 0 && (
            <div className="mb-4 flex gap-2 flex-wrap">
              {product.gallery.map((img, idx) => (
                <img key={idx} src={img} alt="Фото товара" className="w-24 h-24 object-cover rounded" />
              ))}
            </div>
          )}
          <button onClick={handleOrder} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold mt-4">
            Заказать
          </button>
          {orderSuccess && <div className="mt-2 text-green-600">Заявка отправлена!</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
