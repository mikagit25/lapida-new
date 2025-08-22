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
import React, { useEffect, useState, useRef } from 'react';
import CompanyGallery from '../components/CompanyGallery';
import ProductList from '../components/ProductList';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CompanyQRCodeBlock from '../components/CompanyQRCodeBlock';
import CompanyMap from '../components/CompanyMap';
import CompanyNewsForm from '../components/CompanyNewsForm';
import CompanyDocumentsForm from '../components/CompanyDocumentsForm';
import CompanyContactsForm from '../components/CompanyContactsForm';
import CustomSlugEditor from '../components/CustomSlugEditor';
import CompanyEditForm from '../components/CompanyEditForm';

// Обработчик клика по карте через useMapEvents
function MapClickHandler({ setEditForm, setMapCenter }) {
  useMapEvents({
    click(e) {
      setEditForm(f => ({ ...f, lat: e.latlng.lat, lng: e.latlng.lng }));
      setMapCenter([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
}

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
  const [mapCenter, setMapCenter] = useState([55.751244, 37.618423]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [products, setProducts] = useState([]);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productEditData, setProductEditData] = useState(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [mapError, setMapError] = useState('');
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState(true);
  const [slugCheckLoading, setSlugCheckLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
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
      setSlug(company.customSlug || '');
      setCustomSlugInput(company.customSlug || '');
    }
  }, [company]);

  useEffect(() => {
    if (tab === 'gallery' && company) refetchCompany();
    if (tab === 'products') fetchProducts();
  }, [tab]);

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
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/companies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
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
      setEditError(e?.message ? `Ошибка сохранения: ${e.message}` : 'Ошибка сохранения');
      if (editError) {
        console.log('Ошибка сохранения:', editError);
      }
    }
    setEditLoading(false);
  }

  // Геокодирование адреса через Nominatim
  const geocodeAddress = async (address) => {
    if (!address) return;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      console.log('Поиск адреса:', url);
      const res = await fetch(url);
      const data = await res.json();
      console.log('Ответ Nominatim:', data);
      if (data && data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        const foundAddress = data[0].display_name || '';
        setEditForm(f => ({ ...f, lat, lng, foundAddress }));
        setMapCenter([lat, lng]);
        setMapError('');
      } else {
        setMapError('Адрес не найден');
        console.warn('Адрес не найден:', address);
      }
    } catch (e) {
      setMapError('Ошибка поиска адреса');
      console.error('Ошибка поиска адреса:', e);
    }
  };

  const isOwner = company && company.isOwner;

  const handleSlugChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    setSlug(value);
    setEditForm(f => {
      // Не отправлять пустой customSlug на сервер
      if (!value) {
        const { customSlug, ...rest } = f;
        return { ...rest };
      }
      return { ...f, customSlug: value };
    });
    if (!value) {
      setSlugAvailable(true);
      setSlugCheckLoading(false);
      return;
    }
    setSlugCheckLoading(true);
    fetch(`/api/companies/check-slug?slug=${value}`)
      .then(res => res.json())
      .then(data => setSlugAvailable(data.available))
      .catch(() => setSlugAvailable(false))
      .finally(() => setSlugCheckLoading(false));
  };

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!company) return <div className="p-8 text-gray-500">Нет данных о компании</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex gap-2 items-center">
          <Link to={company.customSlug ? `/company/${company.customSlug}` : `/companies/${company._id}`} className="text-blue-600 hover:underline">← Назад к компании</Link>
          <span className="text-gray-400">|</span>
          <span className="font-bold">Личный кабинет компании</span>
        </div>
        {/* Быстрые действия для владельца */}
        {company && company._id && company.isOwner && (
          <div className="mb-4 flex gap-3 items-center">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold" onClick={() => setTab('products')}>Товары/Услуги</button>
            <Link
              to={company.customSlug ? `/company/${company.customSlug}/bulk-products` : `/company/${company._id}/bulk-products`}
              className="bg-green-100 text-green-800 px-4 py-2 rounded hover:bg-green-200 font-semibold border border-green-300"
            >
              Массовое добавление товаров
            </Link>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 font-semibold" onClick={() => setTab('info')}>Информация</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold" onClick={() => navigate(`/company-orders/${company._id}`)}>Заказы компании</button>
          </div>
        )}
        {/* Статистика компании */}
        <div className="mb-4 flex gap-8 items-center text-sm text-gray-700">
          <div><b>Товаров:</b> {products.length}</div>
          <div><b>Заказов:</b> {company.ordersCount ?? '—'}</div>
          <div><b>Отзывы:</b> {Array.isArray(company.reviews) ? company.reviews.length : '—'}</div>
        </div>
        <CompanyTabs tabs={TABS} currentTab={tab} setTab={setTab} />
        <div className="bg-white rounded-lg shadow p-6">
          {/* QR-код компании с актуальным адресом */}
          <CompanyQRCodeBlock
            url={company.customSlug ? `${window.location.origin}/${company.customSlug}` : `${window.location.origin}/companies/${company._id}`}
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