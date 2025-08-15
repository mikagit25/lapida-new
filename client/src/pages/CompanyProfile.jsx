import React from 'react';
import { Link } from 'react-router-dom';
import CompanyHeader from '../components/CompanyHeader';
import CompanyInfo from '../components/CompanyInfo';
import CompanyGallery from '../components/CompanyGallery';
import CompanyNews from '../components/CompanyNews';
import CompanyDocuments from '../components/CompanyDocuments';
import CompanyReviews from '../components/CompanyReviews';
import CompanyTeam from '../components/CompanyTeam';
import CompanyContacts from '../components/CompanyContacts';
import ProductList from '../components/ProductList';

export default function CompanyProfile({ company, user, news, team, contacts }) {
  if (!company) return <div>Компания не найдена</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/companies" className="text-blue-600 hover:underline mb-4 block">← Назад к каталогу компаний</Link>
      <CompanyHeader company={company} />
      {/* Show extra string under name if present */}
      {company.extra && (
        <div className="text-gray-500 mb-2">{company.extra}</div>
      )}
      {/* Show address if present */}
      {false && company.address && (
        <div className="text-gray-700 mb-2">Адрес: {company.address}</div>
      )}
      {/* Show map if present */}
      {company.map && (
        <div className="mb-4">
          <iframe src={company.map} title="Карта" width="100%" height="200" style={{ border: 0 }} allowFullScreen="" loading="lazy"></iframe>
        </div>
      )}
      <CompanyInfo company={company} />
      {user && company.owner === user.id && (
        <Link to={`/company-cabinet/${company._id}`} className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">Личный кабинет</Link>
      )}
      <CompanyGallery images={company.gallery} companyId={company._id} isOwner={company.owner === user?.id} />
      {/* Мини-каталог товаров компании */}
      {company.products && company.products.length > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-xl mb-2">Товары и услуги</h2>
          <ProductList products={company.products} />
        </div>
      )}
      <CompanyNews news={news} />
      <CompanyDocuments documents={company.documents} />
      <CompanyReviews reviews={company.reviews} />
      <CompanyTeam team={team} />
      <CompanyContacts contacts={company.contacts} phones={company.phones} emails={company.emails} />
      {/* Раздел адрес и карта */}
      {(company.address || (company.lat && company.lng)) && (
        <div className="mb-8">
          <h2 className="font-semibold text-xl mb-2">Адрес и карта</h2>
          {company.address && <div className="mb-2">Адрес: {company.address}</div>}
          {(company.lat && company.lng) && (
            <div className="mb-2">
              <div className="text-sm text-gray-500">Координаты: {company.lat}, {company.lng}</div>
              <div style={{ height: '250px', width: '100%' }}>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${company.lng-0.01},${company.lat-0.01},${company.lng+0.01},${company.lat+0.01}&layer=mapnik&marker=${company.lat},${company.lng}`}
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
    </div>
  );
}
