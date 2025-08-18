import QRCode from 'react-qr-code';
import React, { useState } from 'react';
import CustomSlugEditor from '../components/CustomSlugEditor';
import { Link } from 'react-router-dom';
import CompanyHeader from '../components/CompanyHeader';
import CompanyInfo from '../components/CompanyInfo';
// Removed duplicate import of React
import CompanyNews from '../components/CompanyNews';
import CompanyGallery from '../components/CompanyGallery';
import ProductList from '../components/ProductList';
import CompanyDocumentsViewer from '../components/CompanyDocumentsViewer';
import ReviewsFeed from '../components/ReviewsFeed';
import CompanyTeam from '../components/CompanyTeam';
import CompanyContacts from '../components/CompanyContacts';
import CompanyReviewForm from '../components/CompanyReviewForm';
export default function CompanyProfile({ company, userData, news, team, contacts }) {
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  // Гарантируем, что owner всегда определён
  const initialCompanyState = {
    ...company,
    owner: company.owner || (company.owner === undefined && userData?._id ? userData._id : undefined)
  };
  const [companyState, setCompanyState] = useState(initialCompanyState);
  // Явная проверка владельца
  const userId = userData?._id || userData?.id;
  const isOwner = userId && companyState && companyState.owner?.toString() === userId.toString();

  React.useEffect(() => {
    async function fetchReviews() {
      setReviewsLoading(true);
      setReviewsError('');
      try {
        const res = await fetch(`/api/companies/${companyState._id}/reviews`);
        const data = await res.json();
        if (res.ok && data.reviews) {
          setReviews(data.reviews);
        } else {
          setReviewsError(data.message || 'Ошибка загрузки отзывов');
        }
      } catch (e) {
        setReviewsError('Ошибка загрузки отзывов');
      }
      setReviewsLoading(false);
    }
    if (companyState && companyState._id) fetchReviews();
  }, [companyState]);

  // Обработчик для обновления customSlug
  const handleSlugSaved = (newSlug) => {
    setCompanyState(prev => ({ ...prev, customSlug: newSlug }));
  };

  // Обработчик загрузки горизонтальных обоев
  const handleHeaderBgUpload = async (event) => {
  // Removed duplicate import of React
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Размер файла не должен превышать 5MB');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('headerBackground', file);
      const API_BASE_URL = window.location.origin;
      const response = await fetch(`${API_BASE_URL}/api/companies/${company._id}/header-background`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || localStorage.getItem('authToken')}`
        },
        body: formData
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка загрузки');
      }
      const data = await response.json();
      setCompanyState(prev => ({ ...prev, headerBackground: data.headerBackground }));
      alert('Обои успешно загружены!');
    } catch (error) {
      alert('Ошибка при загрузке изображения: ' + error.message);
    } finally {
      event.target.value = '';
    }
  };

  if (!companyState) return <div>Компания не найдена</div>;

  const companyUrl = companyState.customSlug
    ? `${window.location.origin}/${companyState.customSlug}`
    : `${window.location.origin}/companies/${companyState._id}`;

  return (
  <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/companies" className="text-blue-600 hover:underline mb-4 block">← Назад к каталогу компаний</Link>
      <CompanyHeader company={companyState} canEdit={isOwner} onHeaderBgUpload={handleHeaderBgUpload} />
      {isOwner && (
        <Link to={`/company-cabinet/${companyState._id}`} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">Личный кабинет</Link>
      )}
      {/* Show extra string under name if present */}
      {companyState.extra && (
        <div className="text-gray-500 mb-2">{companyState.extra}</div>
      )}
      {/* Show address if present */}
      {false && companyState.address && (
        <div className="text-gray-700 mb-2">Адрес: {companyState.address}</div>
      )}
      {/* Show map if present */}
      {companyState.map && (
        <div className="mb-4">
          <iframe src={companyState.map} title="Карта" width="100%" height="200" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
        </div>
      )}
      <CompanyInfo company={companyState} />
      {/* Мини-каталог товаров компании */}
      {companyState.products && companyState.products.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-xl mb-2">Товары и услуги</h2>
          <ProductList products={companyState.products} />
        </div>
      )}
      <CompanyNews news={news} />
      <CompanyDocumentsViewer documents={companyState.documents} />
  {/* <CompanyReviews reviews={companyState.reviews} /> */}
      <CompanyTeam team={team} />
      <CompanyContacts contacts={companyState.contacts} phones={companyState.phones} emails={companyState.emails} />
      {/* Раздел адрес и карта */}
      {(companyState.address || (companyState.lat && companyState.lng)) && (
        <div className="mb-8">
          <h2 className="font-semibold text-xl mb-2">Адрес и карта</h2>
          {companyState.address && <div className="mb-2">Адрес: {companyState.address}</div>}
          {(companyState.lat && companyState.lng) && (
            <div className="mb-2">
              <div className="text-sm text-gray-500">Координаты: {companyState.lat}, {companyState.lng}</div>
              <div style={{ height: '250px', width: '100%' }}>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${companyState.lng-0.01},${companyState.lat-0.01},${companyState.lng+0.01},${companyState.lat+0.01}&layer=mapnik&marker=${companyState.lat},${companyState.lng}`}
                  style={{ border: 0, width: '100%', height: '100%' }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Карта компании"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {/* QR-код и поделиться */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">QR-код компании</h2>
        <div className="flex flex-col items-center gap-4">
          <QRCode value={companyUrl} size={160} />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded font-semibold mt-2"
            onClick={() => {
              navigator.clipboard.writeText(companyUrl);
            }}
          >
            Поделиться ссылкой
          </button>
        </div>
      </div>

      {/* Reviews block at the bottom */}
      <div className="mt-12">
        <h2 className="font-semibold text-xl mb-4">Отзывы о компании</h2>
        <CompanyReviewForm companyId={companyState._id} onReviewAdded={review => setReviews(r => [review, ...r])} />
        {reviewsLoading && <div className="text-gray-500">Загрузка отзывов...</div>}
        {reviewsError && <div className="text-red-600 mb-2">{reviewsError}</div>}
        {reviews.length === 0 && !reviewsLoading ? (
          <div className="text-gray-500">Пока нет отзывов</div>
        ) : (
          <ReviewsFeed reviews={reviews} />
        )}
      </div>
    </div>
  );
}
