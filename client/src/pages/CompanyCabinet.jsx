import ProductForm from '../components/ProductForm';
import React, { useEffect, useState, useCallback } from 'react';
import CompanyGallery from '../components/CompanyGallery';
import ProductList from '../components/ProductList';
import { useParams, Link, useNavigate } from 'react-router-dom';

function CompanyCabinet() {
  // Функция для рефетча компании
  const refetchCompany = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/companies/${id}`, {
        headers,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.company) {
        setCompany(data.company);
      } else {
        setError('Компания не найдена');
      }
    } catch (e) {
      setError('Ошибка загрузки компании');
    }
    setLoading(false);
  };
  const TABS = [
    { key: 'info', label: 'Информация' },
    { key: 'gallery', label: 'Галерея' },
    { key: 'products', label: 'Товары/Услуги' },
    { key: 'documents', label: 'Документы' },
    { key: 'news', label: 'Новости' },
    { key: 'reviews', label: 'Отзывы' },
  ];
  const [tab, setTab] = useState('info');
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  // --- Products state ---
  const [products, setProducts] = useState([]);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productEditData, setProductEditData] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');

  useEffect(() => {
    async function fetchCompany() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('authToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`/api/companies/${id}`, {
          headers,
          credentials: 'include',
        });
        const data = await res.json();
        if (data.company) {
          setCompany(data.company);
          setEditForm({
            name: data.company.name || '',
            description: data.company.description || '',
          });
        } else {
          setError('Компания не найдена');
        }
      } catch (e) {
        setError('Ошибка загрузки компании');
      }
      setLoading(false);
    }
    fetchCompany(); // всегда при изменении id
  }, [id]);

  useEffect(() => {
    if (tab === 'gallery') {
      refetchCompany(); // рефетч только при переходе на галерею
    }
    if (tab === 'products') {
      fetchProducts();
    }
  }, [tab]);

  // --- Products CRUD ---
  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/companies/${id}/products`, {
        headers,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      } else {
        setProductsError('Не удалось загрузить товары');
      }
    } catch (e) {
      setProductsError('Ошибка загрузки товаров');
    }
    setProductsLoading(false);
  };

  const handleAddProduct = () => {
    setProductEditData(null);
    setProductFormOpen(true);
  };

  const handleEditProduct = (prod) => {
    setProductEditData(prod);
    setProductFormOpen(true);
  };

  const handleDeleteProduct = async (prod) => {
    if (!window.confirm('Удалить товар?')) return;
    setProductsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/companies/${id}/products/${prod._id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });
      if (res.ok) {
        setProducts(products => products.filter(p => p._id !== prod._id));
      } else {
        setProductsError('Ошибка удаления товара');
      }
    } catch (e) {
      setProductsError('Ошибка удаления товара');
    }
    setProductsLoading(false);
  };

  const handleSaveProduct = async (fd) => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const token = localStorage.getItem('authToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const method = productEditData ? 'PUT' : 'POST';
      const url = productEditData ? `/api/companies/${id}/products/${productEditData._id}` : `/api/companies/${id}/products`;
      const res = await fetch(url, {
        method,
        headers: { ...headers },
        credentials: 'include',
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProductFormOpen(false);
        // Если это новый товар, добавляем задержку перед переходом
        if (!productEditData) {
          setTimeout(() => {
            navigate(`/products/${data.product.slug}`);
          }, 500);
        } else {
          fetchProducts();
        }
      } else {
        setProductsError(data.message || 'Ошибка сохранения товара');
      }
    } catch (e) {
      setProductsError('Ошибка сохранения товара');
    }
    setProductsLoading(false);
  };

  useEffect(() => {
    console.log('CompanyCabinet gallery:', company?.gallery);
  }, [company?.gallery]);

  // Проверка владельца
  const isOwner = company && company.isOwner;

  // Обработка редактирования информации
  async function handleEditCompany(e) {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      console.log('Ответ сервера на сохранение:', data);
      // Считаем успешным любой ответ без ошибки и с изменёнными данными
      if (res.ok && (!data.error && !data.message)) {
        setCompany(prev => ({ ...prev, ...editForm }));
        setEditSuccess('Изменения сохранены');
        setEditError('');
      } else if (data.success) {
        setCompany(prev => ({ ...prev, ...editForm }));
        setEditSuccess('Изменения сохранены');
        setEditError('');
      } else {
        setEditError(data.message || 'Ошибка сохранения');
      }
    } catch (e) {
  setEditError(e?.message ? `Ошибка сохранения: ${e.message}` : 'Ошибка сохранения');
  // Выводим подробное сообщение ошибки, если оно есть
  if (editError) {
    console.log('Ошибка сохранения:', editError);
  }
    }
    setEditLoading(false);
  }

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!company) return null;
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
                <h2 className="font-semibold text-xl mb-4">Информация о компании</h2>
                <div className="mb-4">
                  <div className="font-bold text-lg">{company.name}</div>
                  <div className="text-gray-700 mb-2">{company.description}</div>
                  <div className="text-sm text-gray-500">ID: {company._id}</div>
                </div>
                {isOwner && (
                  <form className="flex flex-col gap-3 mb-6" onSubmit={handleEditCompany}>
                    <input
                      className="border px-3 py-2 rounded"
                      value={editForm.name}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Название компании"
                    />
                    <textarea
                      className="border px-3 py-2 rounded"
                      value={editForm.description}
                      onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Описание"
                    />
                    {editError && <div className="text-red-600 text-sm">{editError}</div>}
                    {editSuccess && <div className="text-green-600 text-sm">{editSuccess}</div>}
                    <button type="submit" disabled={editLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
                      {editLoading ? 'Сохранение...' : 'Сохранить изменения'}
                    </button>
                  </form>
                )}
              </div>
            )}
            {tab === 'gallery' && (
              <div>
                <h2 className="font-semibold mb-2">Галерея</h2>
                <CompanyGallery
                  companyId={company._id}
                  images={company.gallery || []}
                  isOwner={isOwner}
                  onImagesUpdate={newGallery => setCompany(prev => ({ ...prev, gallery: newGallery }))}
                />
              </div>
            )}
            {tab === 'products' && (
              <div>
                <h2 className="font-semibold mb-2">Товары / услуги</h2>
                {productsLoading && <div className="text-gray-500">Загрузка...</div>}
                {productsError && <div className="text-red-600 mb-2">{productsError}</div>}
                {!productFormOpen && isOwner && (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded mb-4" onClick={handleAddProduct}>Добавить товар/услугу</button>
                )}
                {!productFormOpen && (
                  <>
                    <ProductList
                      products={products}
                      onEdit={isOwner ? handleEditProduct : undefined}
                      onDelete={isOwner ? handleDeleteProduct : undefined}
                    />
                  </>
                )}
                {productFormOpen && (
                  <ProductForm
                    initialData={productEditData}
                    onSave={handleSaveProduct}
                    onCancel={() => setProductFormOpen(false)}
                  />
                )}
              </div>
            )}
            {tab === 'documents' && (
              <div>
                <h2 className="font-semibold mb-2">Документы</h2>
                {/* Здесь будет список документов и форма добавления */}
              </div>
            )}
            {tab === 'news' && (
              <div>
                <h2 className="font-semibold mb-2">Новости / акции</h2>
                {/* Здесь будет список новостей и форма добавления */}
              </div>
            )}
            {tab === 'reviews' && (
              <div>
                <h2 className="font-semibold mb-2">Отзывы</h2>
                {/* Здесь будет список отзывов */}
              </div>
            )}
          </div>
        </div>
      </div>
  );
  }

  export default CompanyCabinet;
