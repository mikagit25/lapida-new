import CompanyNotificationsList from '../components/CompanyNotificationsList';
import CompanyNewsBlock from '../components/CompanyNewsBlock';
import CompanyDocumentsBlock from '../components/CompanyDocumentsBlock';
import CompanyGalleryBlock from '../components/CompanyGalleryBlock';
import CompanyProductsBlock from '../components/CompanyProductsBlock';
import CompanyAddressMap from '../components/CompanyAddressMap';
import CompanyReviewsBlock from '../components/CompanyReviewsBlock';
import CompanyTabs from '../components/CompanyTabs';
import CompanyLogoUploader from '../components/CompanyLogoUploader';
import ProductForm from '../components/ProductForm';
import DeleteCompanyButton from '../components/DeleteCompanyButton';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import CompanyGallery from '../components/CompanyGallery';
import ProductList from '../components/ProductList';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CompanyQRCodeBlock from '../components/CompanyQRCodeBlock';
import CompanyAnalytics from '../components/CompanyAnalytics';
import CompanyMap from '../components/CompanyMap';
import CompanyNewsForm from '../components/CompanyNewsForm';
import CompanyDocumentsForm from '../components/CompanyDocumentsForm';
import CompanyContactsForm from '../components/CompanyContactsForm';
import CompanyEditForm from '../components/CompanyEditForm';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';

function CompanyCabinet() {
  const TABS = [
    { key: 'info', label: 'Информация' },
    { key: 'address', label: 'Адрес и карта' },
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
  const [editForm, setEditForm] = useState({ name: '', description: '', inn: '', extra: '', address: '', lat: null, lng: null, phones: [], emails: [], news: [], documents: [], customSlug: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productEditData, setProductEditData] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [mapError, setMapError] = useState('');
  const [customSlugInput, setCustomSlugInput] = useState('');
  const mapRef = useRef(null);

  // Центрировать карту на маркере при изменении координат
  useEffect(() => {
    if (editForm.lat && editForm.lng && mapRef.current) {
      mapRef.current.setView([editForm.lat, editForm.lng], mapRef.current.getZoom());
    }
  }, [editForm.lat, editForm.lng]);

  useEffect(() => {
    async function fetchCompany() {
      setLoading(true);
      setError('');
      try {
        const res = await apiFetch(`${API_BASE_URL}/companies/${id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.company) {
          setCompany(data.company);
        } else {
          setError('Компания не найдена');
        }
      } catch (e) {
          console.error('Ошибка загрузки компании:', e);
        setError('Ошибка загрузки компании');
      }
      setLoading(false);
    }
    fetchCompany();
  }, [id]);

  // Инициализация editForm только при первой загрузке company
  useEffect(() => {
    if (company && !editForm._initialized) {
      setEditForm({
        name: company.name || '',
        description: company.description || '',
        inn: company.inn || '',
        extra: company.extra || '',
        address: company.address || '',
        lat: typeof company.lat === 'number' ? company.lat : (company.lat ? parseFloat(company.lat) : null),
        lng: typeof company.lng === 'number' ? company.lng : (company.lng ? parseFloat(company.lng) : null),
        phones: Array.isArray(company.phones) ? company.phones : [],
        emails: Array.isArray(company.emails) ? company.emails : [],
        news: Array.isArray(company.news) ? company.news : [],
        documents: Array.isArray(company.documents) ? company.documents : [],
        customSlug: company.customSlug || '',
        _initialized: true
      });
      setCustomSlugInput(company.customSlug || '');
    }
  }, [company, editForm._initialized]);

  const refetchCompany = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(`${API_BASE_URL}/companies/${id}`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.company) {
        setCompany(data.company);
      } else {
        setError('Компания не найдена');
      }
    } catch (e) {
        console.error('Ошибка загрузки компании:', e);
      setError('Ошибка загрузки компании');
    }
    setLoading(false);
  }, [id]);

  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const res = await apiFetch(`${API_BASE_URL}/companies/${id}/products`, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      } else {
        setProductsError('Не удалось загрузить товары');
      }
    } catch (e) {
        console.error('Ошибка загрузки товаров:', e);
      setProductsError('Ошибка загрузки товаров');
    }
    setProductsLoading(false);
  }, [id]);

  // Загружаем данные вкладок по переключению (без повторного цикла от company state)
  useEffect(() => {
    if (tab === 'gallery') refetchCompany();
    if (tab === 'products') fetchProducts();
  }, [tab, refetchCompany, fetchProducts]);

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
      const res = await apiFetch(`${API_BASE_URL}/companies/${id}/products/${prod._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setProducts(products => products.filter(p => p._id !== prod._id));
      } else {
        setProductsError('Ошибка удаления товара');
      }
    } catch (e) {
        console.error('Ошибка удаления товара:', e);
      setProductsError('Ошибка удаления товара');
    }
    setProductsLoading(false);
  };

  const handleSaveProduct = async (fd) => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const method = productEditData ? 'PUT' : 'POST';
      const url = productEditData ? `${API_BASE_URL}/companies/${id}/products/${productEditData._id}` : `${API_BASE_URL}/companies/${id}/products`;
      const res = await apiFetch(url, {
        method,
        credentials: 'include',
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProductFormOpen(false);
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
        console.error('Ошибка сохранения товара:', e);
      setProductsError('Ошибка сохранения товара');
    }
    setProductsLoading(false);
  };

  async function handleEditCompany(arg) {
    // Если пришёл массив документов — обновить только их
    let newForm = { ...editForm };
    if (Array.isArray(arg)) {
      newForm.documents = arg;
    } else if (arg && arg.preventDefault) {
      arg.preventDefault();
    }
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');
    try {
      const res = await apiFetch(`${API_BASE_URL}/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...newForm,
          lat: newForm.lat,
          lng: newForm.lng,
          phones: newForm.phones,
          emails: newForm.emails,
          news: newForm.news,
          documents: newForm.documents,
          customSlug: customSlugInput || undefined
        }),
      });
      const data = await res.json();
      if (res.ok && (!data.error && !data.message)) {
        setCompany(prev => ({ ...prev, ...newForm, customSlug: customSlugInput }));
        setEditForm(f => ({ ...f, customSlug: customSlugInput }));
        setCustomSlugInput(customSlugInput);
        setEditSuccess('Изменения сохранены');
        setEditError('');
      } else if (data.success) {
        setCompany(prev => ({ ...prev, ...newForm, customSlug: customSlugInput }));
        setEditForm(f => ({ ...f, customSlug: customSlugInput }));
        setCustomSlugInput(customSlugInput);
        setEditSuccess('Изменения сохранены');
        setEditError('');
      } else {
        setEditError(data.message || 'Ошибка сохранения');
      }
    } catch (e) {
        console.error('Ошибка сохранения компании:', e);
      setEditError(e?.message ? `Ошибка сохранения: ${e.message}` : 'Ошибка сохранения');
      if (editError) {
        console.log('Ошибка сохранения:', editError);
      }
    }
    setEditLoading(false);
  }

  // Геокодирование адреса через Nominatim
  const isOwner = company && company.isOwner;

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!company) return <div className="p-8 text-gray-500">Нет данных о компании</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-2 items-center">
          <Link to={`/company/${company.customSlug || company._id}`} className="text-blue-600 hover:underline">← Назад к компании</Link>
          <span className="text-gray-400">|</span>
          <span className="font-bold">Личный кабинет компании</span>
        </div>
  {/* Быстрый переход в личные кабинеты компаний пользователя */}
  {/* Аналитика компании */}
  <CompanyAnalytics companyId={company._id} />
        <CompanyTabs tabs={TABS} currentTab={tab} setTab={setTab} />
        <div className="bg-white rounded-lg shadow p-6">
          {/* QR-код компании с актуальным адресом */}
          <CompanyQRCodeBlock
            url={company.customSlug ? `${window.location.origin}/company/${company.customSlug}` : `${window.location.origin}/company/${company._id}`}
          />
          {tab === 'info' && (
            <div>
              <h2 className="font-semibold text-xl mb-4">Информация о компании</h2>
              <div className="mb-4 flex gap-6 items-center">
                <div>
                  <div className="font-bold text-lg">{company.name}</div>
                  <div className="text-gray-700 mb-2">{company.description}</div>
                  <div className="text-sm text-gray-500">ID: {company._id}</div>
                  <div className="text-sm text-gray-500">ИНН: {company.inn}</div>
                  {company.extra && <div className="text-gray-600 mt-2">{company.extra}</div>}
                </div>
                <div className="flex flex-col items-center">
                  <img src={company.logo || '/default-company-logo.png'} alt="Логотип компании" className="w-20 h-20 object-cover rounded-full border mb-2" />
                  <CompanyLogoUploader company={company} isOwner={isOwner} setCompany={setCompany} />
                </div>
              </div>
              <CompanyEditForm
                editForm={editForm}
                setEditForm={setEditForm}
                handleEditCompany={handleEditCompany}
                editLoading={editLoading}
                editError={editError}
                editSuccess={editSuccess}
                company={company}
                isOwner={isOwner}
              />
              {!isOwner && (
                <div className="mb-4">
                  <label className="block font-medium mb-1">Адрес компании (URL)</label>
                  <div className="mb-2 text-sm text-gray-600">lapida.one/{company.customSlug}</div>
                </div>
              )}
              <CompanyContactsForm
                editForm={editForm}
                setEditForm={setEditForm}
                editLoading={editLoading}
                editError={editError}
                editSuccess={editSuccess}
                handleEditCompany={handleEditCompany}
              />
            </div>
          )}
          {tab === 'address' && (
            <CompanyAddressMap
              editForm={editForm}
              setEditForm={setEditForm}
              mapError={mapError}
              setMapError={setMapError}
              editLoading={editLoading}
              editError={editError}
              editSuccess={editSuccess}
              handleEditCompany={handleEditCompany}
            />
          )}
          {tab === 'gallery' && (
            <CompanyGalleryBlock
              companyId={company._id}
              gallery={company.gallery || []}
              isOwner={isOwner}
              onImagesUpdate={newGallery => setCompany(prev => ({ ...prev, gallery: newGallery }))}
            />
          )}
          {tab === 'products' && (
            <>
              <div className="mb-4 flex justify-end">
                <Link
                  to={`/company/${company.customSlug || company._id}/bulk-products`}
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-semibold"
                >
                  Массовый импорт товаров (таблица)
                </Link>
              </div>
              <CompanyProductsBlock
                products={products}
                productsLoading={productsLoading}
                productsError={productsError}
                productFormOpen={productFormOpen}
                isOwner={isOwner}
                handleAddProduct={handleAddProduct}
                handleEditProduct={handleEditProduct}
                handleDeleteProduct={handleDeleteProduct}
                handleSaveProduct={handleSaveProduct}
                productEditData={productEditData}
                setProductFormOpen={setProductFormOpen}
              />
            </>
          )}
          {tab === 'documents' && (
            <CompanyDocumentsBlock
              documents={editForm.documents || []}
              setDocuments={docs => setEditForm(f => ({ ...f, documents: docs }))}
              onSave={handleEditCompany}
              loading={editLoading}
              error={editError}
              success={editSuccess}
            />
          )}
          {tab === 'news' && (
            <CompanyNewsBlock
              news={editForm.news || []}
              setNews={news => setEditForm(f => ({ ...f, news }))}
              onSave={handleEditCompany}
              loading={editLoading}
              error={editError}
              success={editSuccess}
            />
          )}
          {tab === 'reviews' && <CompanyReviewsBlock />}
        </div>
      </div>
      {/* Уведомления компании для владельца */}
      {company && company._id && company.isOwner && (
        <div className="max-w-2xl mx-auto my-8">
          <CompanyNotificationsList companyId={company._id} />
        </div>
      )}
      {/* Кнопка удаления компании внизу страницы */}
      <div className="flex justify-center mt-8 gap-4">
        {company && company._id && (
          <DeleteCompanyButton companyId={company._id} onDeleted={() => navigate('/companies')} />
        )}
      </div>
    </div>
  );
}

export default CompanyCabinet;