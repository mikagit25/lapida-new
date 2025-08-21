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
    async function fetchNews() {
      setNewsLoading(true);
      setNewsError('');
      try {
        const res = await fetch(`/api/companies/${companyState._id}/news`);
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
    ? `${window.location.origin}/company/${companyState.customSlug}`
    : `${window.location.origin}/companies/${companyState._id}`;

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
      {/* Мини-каталог товаров компании */}
      <CompanyProductsProfileBlock products={companyState.products} />
      <CompanyNewsProfileBlock news={companyNews} />
      {newsLoading && <div className="text-gray-500">Загрузка новостей...</div>}
      {newsError && <div className="text-red-600 mb-2">{newsError}</div>}
      <CompanyDocumentsProfileBlock documents={companyState.documents} />
      {/* <CompanyReviews reviews={companyState.reviews} /> */}
      <CompanyTeamProfileBlock team={team} />
      <CompanyContactsProfileBlock contacts={companyState.contacts} phones={companyState.phones} emails={companyState.emails} />
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
          ? `${window.location.origin}/${companyState.customSlug}`
          : `${window.location.origin}/companies/${companyState._id}`}
      />
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
      <CompanyInfo company={companyState} />
      {/* Мини-каталог товаров компании */}
      <CompanyProductsProfileBlock products={companyState.products} />
      <CompanyNewsProfileBlock news={companyNews} />
      {newsLoading && <div className="text-gray-500">Загрузка новостей...</div>}
      {newsError && <div className="text-red-600 mb-2">{newsError}</div>}
      <CompanyDocumentsProfileBlock documents={companyState.documents} />
      {/* <CompanyReviews reviews={companyState.reviews} /> */}
      <CompanyTeamProfileBlock team={team} />
      <CompanyContactsProfileBlock contacts={companyState.contacts} phones={companyState.phones} emails={companyState.emails} />
      {/* Show address and map if present (OpenStreetMap) - теперь ниже контактов */}
      {(companyState.address || (companyState.lat && companyState.lng)) && (
        <CompanyAddressMapProfileBlock
          address={companyState.address}
          lat={companyState.lat}
          lng={companyState.lng}
        />
      )}
      <CompanyReviewsProfileBlock
        companyId={companyState._id}
        reviews={reviews}
        reviewsLoading={reviewsLoading}
        reviewsError={reviewsError}
        onReviewAdded={review => setReviews(r => [review, ...r])}
      />
    </div>
  );
}
