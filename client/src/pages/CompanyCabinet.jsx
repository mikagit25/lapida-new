import ProductForm from '../components/ProductForm';
import DeleteCompanyButton from '../components/DeleteCompanyButton';
import React, { useEffect, useState, useRef } from 'react';
import CompanyGallery from '../components/CompanyGallery';
import ProductList from '../components/ProductList';
import { useParams, Link, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import CompanyMap from '../components/CompanyMap';
import CompanyNewsForm from '../components/CompanyNewsForm';
import CompanyDocumentsForm from '../components/CompanyDocumentsForm';
import CustomSlugEditor from '../components/CustomSlugEditor';

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
          <Link to={company.customSlug ? `/${company.customSlug}` : `/companies/${company._id}`} className="text-blue-600 hover:underline">← Назад к компании</Link>
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
          {/* QR-код компании с актуальным адресом */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">QR-код компании</h2>
            <div className="flex flex-col items-center gap-2">
              <QRCode value={company.customSlug ? `${window.location.origin}/${company.customSlug}` : `${window.location.origin}/companies/${company._id}`} size={128} />
              <div className="text-xs text-gray-500 break-all">{company.customSlug ? `${window.location.origin}/${company.customSlug}` : `${window.location.origin}/companies/${company._id}`}</div>
            </div>
          </div>
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
                  {isOwner && (
                    <form onSubmit={async e => {
                      e.preventDefault();
                      const file = e.target.logo.files[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append('logo', file);
                      const token = localStorage.getItem('authToken');
                      const res = await fetch(`/api/companies/${company._id}/logo`, {
                        method: 'PUT',
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                        body: formData,
                      });
                      const data = await res.json();
                      if (data.logo) setCompany(prev => ({ ...prev, logo: data.logo }));
                    }}>
                      <input type="file" name="logo" accept="image/*" className="mb-2" />
                      <button type="submit" className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Обновить аватар</button>
                    </form>
                  )}
                </div>
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
                  <input
                    className="border px-3 py-2 rounded"
                    value={editForm.inn || company.inn || ''}
                    onChange={e => setEditForm(f => ({ ...f, inn: e.target.value }))}
                    placeholder="ИНН"
                  />
                  <input
                    className="border px-3 py-2 rounded"
                    value={editForm.extra || company.extra || ''}
                    onChange={e => setEditForm(f => ({ ...f, extra: e.target.value }))}
                    placeholder="Дополнительная строка (под названием)"
                  />
                  <CustomSlugEditor
                    companyId={company._id}
                    initialSlug={company.customSlug}
                    isOwner={isOwner}
                    companyName={company.name}
                    isCabinet={true}
                    onSlugSaved={slug => {
                      setEditForm(f => ({ ...f, customSlug: slug }));
                      setCompany(prev => ({ ...prev, customSlug: slug }));
                    }}
                  />
                  {editError && <div className="text-red-600 text-sm">{editError}</div>}
                  {editSuccess && <div className="text-green-600 text-sm">{editSuccess}</div>}
                  <button type="submit" disabled={editLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
                    {editLoading ? 'Сохранение...' : 'Сохранить изменения'}
                  </button>
                </form>
              )}
              {!isOwner && (
                <div className="mb-4">
                  <label className="block font-medium mb-1">Адрес компании (URL)</label>
                  <div className="mb-2 text-sm text-gray-600">lapida.one/{company.customSlug}</div>
                </div>
              )}
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-2">Контакты компании</h3>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Телефоны:</label>
                  {(editForm.phones || []).map((phone, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <input
                        type="text"
                        className="border px-3 py-2 rounded w-full"
                        value={phone}
                        onChange={e => {
                          const phones = [...editForm.phones];
                          phones[idx] = e.target.value;
                          setEditForm(f => ({ ...f, phones }));
                        }}
                        placeholder="Телефон"
                      />
                      <button type="button" className="ml-2 text-xs text-red-600" onClick={() => {
                        const phones = [...editForm.phones];
                        phones.splice(idx, 1);
                        setEditForm(f => ({ ...f, phones }));
                      }}>Удалить</button>
                    </div>
                  ))}
                  <button type="button" className="text-xs bg-gray-200 px-2 py-1 rounded" onClick={() => {
                    setEditForm(f => ({ ...f, phones: [...(f.phones || []), ''] }));
                  }}>Добавить телефон</button>
                </div>
                <div className="mb-4">
                  <label className="block font-medium mb-1">Email:</label>
                  {(editForm.emails || []).map((email, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <input
                        type="email"
                        className="border px-3 py-2 rounded w-full"
                        value={email}
                        onChange={e => {
                          const emails = [...editForm.emails];
                          emails[idx] = e.target.value;
                          setEditForm(f => ({ ...f, emails }));
                        }}
                        placeholder="Email"
                      />
                      <button type="button" className="ml-2 text-xs text-red-600" onClick={() => {
                        const emails = [...editForm.emails];
                        emails.splice(idx, 1);
                        setEditForm(f => ({ ...f, emails }));
                      }}>Удалить</button>
                    </div>
                  ))}
                  <button type="button" className="text-xs bg-gray-200 px-2 py-1 rounded" onClick={() => {
                    setEditForm(f => ({ ...f, emails: [...(f.emails || []), ''] }));
                  }}>Добавить email</button>
                </div>
                <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" disabled={editLoading} onClick={handleEditCompany}>
                  {editLoading ? 'Сохранение...' : 'Сохранить контакты'}
                </button>
                {editError && <div className="text-red-600 text-sm mt-2">{editError}</div>}
                {editSuccess && <div className="text-green-600 text-sm mt-2">{editSuccess}</div>}
              </div>
            </div>
          )}
          {tab === 'address' && (
            <div>
              <h2 className="font-semibold text-xl mb-4">Адрес и карта</h2>
              <CompanyMap
                address={editForm.address}
                lat={editForm.lat}
                lng={editForm.lng}
                setAddress={addr => setEditForm(f => ({ ...f, address: addr }))}
                setLat={lat => setEditForm(f => ({ ...f, lat }))}
                setLng={lng => setEditForm(f => ({ ...f, lng }))}
                foundAddress={editForm.foundAddress}
                setFoundAddress={fa => setEditForm(f => ({ ...f, foundAddress: fa }))}
                mapError={mapError}
                setMapError={setMapError}
              />
              <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold mt-4" disabled={editLoading} onClick={handleEditCompany}>
                {editLoading ? 'Сохранение...' : 'Сохранить адрес и координаты'}
              </button>
              {editError && <div className="text-red-600 text-sm mt-2">{editError}</div>}
              {editSuccess && <div className="text-green-600 text-sm mt-2">{editSuccess}</div>}
            </div>
          )}
          {tab === 'gallery' && (
            <div>
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
                <ProductList
                  products={products}
                  onEdit={isOwner ? handleEditProduct : undefined}
                  onDelete={isOwner ? handleDeleteProduct : undefined}
                />
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
            <CompanyDocumentsForm
              documents={editForm.documents || []}
              setDocuments={docs => setEditForm(f => ({ ...f, documents: docs }))}
              onSave={handleEditCompany}
              loading={editLoading}
              error={editError}
              success={editSuccess}
            />
          )}
          {tab === 'news' && (
            <CompanyNewsForm
              news={editForm.news || []}
              setNews={news => setEditForm(f => ({ ...f, news }))}
              onSave={handleEditCompany}
              loading={editLoading}
              error={editError}
              success={editSuccess}
            />
          )}
          {tab === 'reviews' && (
            <div>
              <h2 className="font-semibold mb-2">Отзывы</h2>
              {/* Здесь будет список отзывов */}
            </div>
          )}
        </div>
      </div>
      {/* Кнопка удаления компании внизу страницы */}
      <div className="flex justify-center mt-8">
        {company && company._id && (
          <DeleteCompanyButton companyId={company._id} onDeleted={() => navigate('/companies')} />
        )}
      </div>
    </div>
  );
}

export default CompanyCabinet;