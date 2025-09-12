import QRCode from 'react-qr-code';
import React, { useState } from 'react';
import CustomSlugEditor from '../components/CustomSlugEditor';
import { Link } from 'react-router-dom';
import CompanyHeader from '../components/CompanyHeader';
import CompanyInfo from '../components/CompanyInfo';
// Removed duplicate import of React
import CompanyNews from '../components/CompanyNews';
import CompanyNewsProfileBlock from '../components/CompanyNewsProfileBlock';
import CompanyGallery from '../components/CompanyGallery';
import ProductList from '../components/ProductList';
import CompanyProductsProfileBlock from '../components/CompanyProductsProfileBlock';
import CompanyDocumentsViewer from '../components/CompanyDocumentsViewer';
import CompanyDocumentsProfileBlock from '../components/CompanyDocumentsProfileBlock';
import ReviewsFeed from '../components/ReviewsFeed';
import CompanyTeam from '../components/CompanyTeam';
import CompanyTeamProfileBlock from '../components/CompanyTeamProfileBlock';
import CompanyContacts from '../components/CompanyContacts';
import CompanyContactsProfileBlock from '../components/CompanyContactsProfileBlock';
import CompanyReviewForm from '../components/CompanyReviewForm';
import CompanyAddressMapProfileBlock from '../components/CompanyAddressMapProfileBlock';
import CompanyReviewsProfileBlock from '../components/CompanyReviewsProfileBlock';
import CompanyQRCodeBlock from '../components/CompanyQRCodeBlock';
import CompanyFAQ from '../components/CompanyFAQ';
import CompanyRecommendations from '../components/CompanyRecommendations';
import CompanyHistory from '../components/CompanyHistory';
import { API_BASE_URL } from '../config/api';
import { apiFetch } from '../services/apiFetch';
export default function CompanyProfile({ company, userData, news, team, contacts }) {
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState('');
  const [companyNews, setCompanyNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState('');
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
    const res = await apiFetch(`${API_BASE_URL}/companies/${companyState._id}/reviews`);
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
    async function fetchNews() {
      setNewsLoading(true);
      setNewsError('');
      try {
    const res = await apiFetch(`${API_BASE_URL}/companies/${companyState._id}/news`);
        const data = await res.json();
        if (res.ok && data.news) {
          setCompanyNews(data.news);
        } else {
          setNewsError(data.message || 'Ошибка загрузки новостей');
        }
      } catch (e) {
        setNewsError('Ошибка загрузки новостей');
      }
      setNewsLoading(false);
    }
    if (companyState && companyState._id) fetchReviews();
    if (companyState && companyState._id) fetchNews();
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
    const response = await apiFetch(`${API_BASE_URL}/companies/${company._id}/header-background`, {
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



  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/companies" className="text-blue-600 hover:underline mb-4 block">← Назад к каталогу компаний</Link>
      <CompanyHeader company={companyState} canEdit={isOwner} onHeaderBgUpload={handleHeaderBgUpload} />
      {isOwner && (
        <Link to={`/company-cabinet/${companyState._id}`} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">Личный кабинет</Link>
      )}
      {/* ...existing code... */}
      {/* Старая поддержка iframe-карты, если поле map есть */}
      {companyState.map && (
        <div className="mb-4">
          <iframe src={companyState.map} title="Карта" width="100%" height="200" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
        </div>
      )}
      <CompanyInfo company={companyState} />

  {/* Галерея компании */}
  <CompanyGallery images={companyState.gallery} isOwner={isOwner} companyId={companyState._id} />

  {/* История компании (этапы, важные даты, достижения) */}
  <CompanyHistory companyId={companyState._id} isOwner={isOwner} />

      {/* Ссылки на разделы компании: часть только для владельца */}
      <div className="my-4 flex flex-wrap gap-2">
        {isOwner && (
          <>
            <Link
              to={companyState.customSlug
                ? `/company/${companyState.customSlug}/crm-integration`
                : `/companies/${companyState._id}/crm-integration`}
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-4 py-2 rounded transition"
            >
              Интеграция с CRM
            </Link>
            <Link
              to={companyState.customSlug
                ? `/company/${companyState.customSlug}/crm-orders`
                : `/companies/${companyState._id}/crm-orders`}
              className="inline-block bg-orange-100 hover:bg-orange-200 text-orange-800 font-semibold px-4 py-2 rounded transition"
            >
              CRM-заказы
            </Link>
            <Link
              to={companyState.customSlug
                ? `/company/${companyState.customSlug}/notifications`
                : `/companies/${companyState._id}/notifications`}
              className="inline-block bg-red-100 hover:bg-red-200 text-red-800 font-semibold px-4 py-2 rounded transition"
            >
              Уведомления
            </Link>
            <Link
              to={companyState.customSlug
                ? `/company/${companyState.customSlug}/analytics`
                : `/companies/${companyState._id}/analytics`}
              className="inline-block bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold px-4 py-2 rounded transition"
            >
              Аналитика
            </Link>
          </>
        )}
        {/* Чат компании можно сделать публичным или только для владельца — оставим публичным, если требуется скрыть, обернуть в isOwner */}
        <Link
          to={companyState.customSlug
            ? `/company/${companyState.customSlug}/chat`
            : `/companies/${companyState._id}/chat`}
          className="inline-block bg-green-100 hover:bg-green-200 text-green-800 font-semibold px-4 py-2 rounded transition"
        >
          Чат компании
        </Link>
        <Link
          to={companyState.customSlug
            ? `/company/${companyState.customSlug}/history`
            : `/companies/${companyState._id}/history`}
          className="inline-block bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold px-4 py-2 rounded transition"
        >
          История компании
        </Link>
        <Link
          to={companyState.customSlug
            ? `/company/${companyState.customSlug}/portfolio`
            : `/company/${companyState._id}/portfolio`}
          className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-4 py-2 rounded transition"
        >
          Портфолио компании
        </Link>
      </div>
      {/* Мини-каталог товаров компании */}
      <CompanyProductsProfileBlock products={companyState.products} />
      <CompanyNewsProfileBlock news={companyNews} />
      {newsLoading && <div className="text-gray-500">Загрузка новостей...</div>}
      {newsError && <div className="text-red-600 mb-2">{newsError}</div>}
      <CompanyDocumentsProfileBlock documents={companyState.documents} />
      {/* <CompanyReviews reviews={companyState.reviews} /> */}
      <CompanyTeamProfileBlock team={team} />
      <CompanyContactsProfileBlock contacts={companyState.contacts} phones={companyState.phones} emails={companyState.emails} />

      {/* Ссылка на контактную форму */}
      <div className="my-4">
        <Link
          to={companyState.customSlug
            ? `/company/${companyState.customSlug}/contact`
            : `/company/${companyState._id}/contact`}
          className="inline-block bg-green-100 hover:bg-green-200 text-green-800 font-semibold px-4 py-2 rounded transition"
        >
          Связаться с компанией
        </Link>
      </div>

      {/* Рекомендации/похожие компании */}
      <CompanyRecommendations companyId={companyState._id} category={companyState.products && companyState.products[0]?.category} />
      {/* Show address and map if present (OpenStreetMap) - теперь ниже контактов */}
      {(companyState.address || (companyState.lat && companyState.lng)) && (
        <CompanyAddressMapProfileBlock
          address={companyState.address}
          lat={companyState.lat}
          lng={companyState.lng}
        />
      )}
      {/* QR-код компании теперь под картой */}
      <CompanyQRCodeBlock
        url={companyState.customSlug
          ? `${window.location.origin}/company/${companyState.customSlug}`
          : `${window.location.origin}/company/${companyState._id}`}
      />

      {/* FAQ компании (вопросы и ответы) */}
      <CompanyFAQ faqs={companyState.faqs || []} />
      <CompanyReviewsProfileBlock
        companyId={companyState._id}
        reviews={reviews}
        reviewsLoading={reviewsLoading}
        reviewsError={reviewsError}
        onReviewAdded={review => setReviews(r => [review, ...r])}
      />
      {/* Show extra string under name if present */}
      {companyState.extra && (
        <div className="text-gray-500 mb-2">{companyState.extra}</div>
      )}
      {/* Старая поддержка iframe-карты, если поле map есть */}
      {companyState.map && (
        <div className="mb-4">
          <iframe src={companyState.map} title="Карта" width="100%" height="200" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
        </div>
      )}
    </div>
  );
}
