import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useParams, Link } from 'react-router-dom';

const CompanyPage = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', address: '', description: '', inn: '', logo: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`/api/companies/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        setCompany(data.company);
        setLoading(false);
        if (data.company) {
          setEditForm({
            name: data.company.name || '',
            address: data.company.address || '',
            description: data.company.description || '',
            inn: data.company.inn || '',
            logo: data.company.logo || ''
          });
        }
      })
      .catch(() => {
        setError('Ошибка загрузки');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-8">Загрузка...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!company) return <div className="p-8">Компания не найдена</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/companies" className="text-blue-600 hover:underline mb-4 inline-block">← Назад к каталогу</Link>
        {/* Отладка: выводим значение isOwner */}
        <div className="mb-2 text-xs text-gray-500">isOwner: {String(company.isOwner)}</div>
        {/* Заголовок, логотип, статус */}
        <div className="flex items-center gap-4 mb-6">
          {company.logo ? (
            <img src={company.logo} alt="Логотип" className="w-24 h-24 object-contain rounded border bg-white" />
          ) : (
            <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded border text-gray-400">Нет логотипа</div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <div className="text-sm text-gray-500">{company.status === 'verified' ? 'Проверена' : 'На проверке'}</div>
          </div>
        </div>
        {/* Адрес, ИНН, описание */}
        <div className="mb-4">
          <div><span className="font-medium">ИНН:</span> {company.inn}</div>
          <div><span className="font-medium">Адрес:</span> {company.address}</div>
          <div className="mt-2">{company.description}</div>
        </div>
        {/* Кнопки для владельца */}
        {company.isOwner && (
          <div className="flex gap-4 mb-6">
            <Link to={`/companies/${company._id}/cabinet`} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Войти в личный кабинет
            </Link>
            <button onClick={() => setEditOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Редактировать профиль
            </button>
          </div>
        )}
        {/* Галерея */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Галерея</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {company.gallery && company.gallery.length > 0 ? (
              company.gallery.map((img, index) => (
                <div key={index} className="aspect-w-1 aspect-h-1 cursor-pointer" onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}>
                  <img src={img} alt={`Галерея ${index + 1}`} className="object-cover rounded-lg shadow" />
                </div>
              ))
            ) : (
              <div className="text-gray-500 col-span-2 sm:col-span-3 text-center py-4">Нет изображений в галерее</div>
            )}
          </div>
          {/* Лайтбокс для просмотра фото с прокруткой */}
          {lightboxOpen && company.gallery && company.gallery.length > 0 && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
              <button className="absolute top-4 right-4 text-white text-3xl" onClick={() => setLightboxOpen(false)} title="Закрыть">×</button>
              <button className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl" onClick={() => setLightboxIndex((lightboxIndex - 1 + company.gallery.length) % company.gallery.length)} title="Предыдущее">‹</button>
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl" onClick={() => setLightboxIndex((lightboxIndex + 1) % company.gallery.length)} title="Следующее">›</button>
              <div className="relative max-w-3xl w-full mx-auto bg-white rounded-lg shadow-lg p-6 z-10 flex flex-col items-center">
                <img src={company.gallery[lightboxIndex]} alt={`Фото ${lightboxIndex + 1}`} className="max-h-[80vh] w-auto object-contain rounded mb-4" />
              </div>
            </div>
          )}
        </div>
        {/* Каталог товаров / услуг */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Товары / услуги</h2>
          <ul className="list-disc pl-5">
            {company.products && company.products.length > 0 ? company.products.map((prod, idx) => (
              <li key={prod._id || idx}>
                <span className="font-semibold">{prod.name}</span> — {prod.price}₽
              </li>
            )) : <div>Нет товаров/услуг</div>}
          </ul>
        </div>
        {/* Новости / акции */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Новости / акции</h2>
          <ul>
            {company.news && company.news.length > 0 ? company.news.map(n => (
              <li key={n._id || n.title} className="mb-4">
                <div className="font-bold">{n.title}</div>
                <div>{n.text}</div>
                {n.image && <img src={n.image} alt="" className="w-32 h-32 object-cover rounded mb-2" />}
                <div className="text-xs text-gray-400">{n.date ? new Date(n.date).toLocaleDateString() : ''}</div>
              </li>
            )) : <div>Нет новостей</div>}
          </ul>
        </div>
        {/* Документы */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Документы</h2>
          <ul className="list-disc pl-5">
            {company.documents && company.documents.length > 0 ? company.documents.map((doc, idx) => (
              <li key={idx}><a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{doc.name || `Документ ${idx + 1}`}</a></li>
            )) : <div>Нет документов</div>}
          </ul>
        </div>
        {/* Отзывы */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Отзывы</h2>
          <ul className="list-disc pl-5">
            {company.reviews && company.reviews.length > 0 ? company.reviews.map((rev, idx) => (
              <li key={idx}><span className="font-semibold">{rev.author}:</span> {rev.text} <span className="text-yellow-500">★ {rev.rating}</span></li>
            )) : <div>Нет отзывов</div>}
          </ul>
        </div>
        {/* Контакты и карта */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Контакты</h2>
          {company.contacts && (
            <div>
              {company.contacts.phone && <div><span className="font-medium">Телефон:</span> <a href={`tel:${company.contacts.phone}`} className="text-blue-600 hover:underline">{company.contacts.phone}</a></div>}
              {company.contacts.email && <div><span className="font-medium">Email:</span> <a href={`mailto:${company.contacts.email}`} className="text-blue-600 hover:underline">{company.contacts.email}</a></div>}
              {company.contacts.website && <div><span className="font-medium">Сайт:</span> <a href={company.contacts.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{company.contacts.website}</a></div>}
              {company.contacts.map && (
                <div className="mt-2">
                  <iframe src={company.contacts.map} title="Карта" width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Команда (внизу) */}
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Команда</h2>
          {company.team && company.team.length > 0 ? (
            <div className="flex gap-4 flex-wrap mb-4">
              {company.team.map(t => (
                <div key={t._id || t.name} className="border rounded p-3 w-64 bg-gray-50 flex flex-col items-center">
                  {t.photo ? <img src={t.photo} alt={t.name} className="w-20 h-20 object-cover rounded-full mb-2" /> : <div className="w-20 h-20 bg-gray-200 rounded-full mb-2 flex items-center justify-center text-gray-400">Нет фото</div>}
                  <div className="font-bold text-lg mb-1">{t.name}</div>
                  <div className="mb-1 text-gray-700">{t.position}</div>
                  {t.contacts && <div className="text-xs text-gray-500">{t.contacts}</div>}
                </div>
              ))}
            </div>
          ) : <div className="text-gray-500 mb-2">Нет сотрудников</div>}
        </div>
      </div>
      {/* Модальное окно редактирования профиля */}
      <Modal
        isOpen={editOpen}
        onRequestClose={() => setEditOpen(false)}
        contentLabel="Редактировать профиль компании"
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-30 z-40"
      >
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
          <h2 className="text-xl font-bold mb-4">Редактировать профиль компании</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setEditLoading(true);
              setEditError("");
              try {
                const res = await fetch(`/api/companies/${company._id}`, {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(editForm),
                });
                const data = await res.json();
                if (data.company) {
                  setCompany(data.company);
                  setEditOpen(false);
                } else {
                  setEditError(data.message || "Ошибка обновления");
                }
              } catch (err) {
                setEditError("Ошибка обновления");
              } finally {
                setEditLoading(false);
              }
            }}
            className="flex flex-col gap-3"
          >
            <input
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Название"
              className="border px-3 py-2 rounded"
              required
            />
            <input
              value={editForm.address}
              onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="Адрес"
              className="border px-3 py-2 rounded"
            />
            <input
              value={editForm.inn}
              onChange={(e) => setEditForm((f) => ({ ...f, inn: e.target.value }))}
              placeholder="ИНН"
              className="border px-3 py-2 rounded"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Описание"
              className="border px-3 py-2 rounded"
            />
            <input
              value={editForm.logo}
              onChange={(e) => setEditForm((f) => ({ ...f, logo: e.target.value }))}
              placeholder="URL логотипа"
              className="border px-3 py-2 rounded"
            />
            {editError && <div className="text-red-600 text-sm">{editError}</div>}
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={editLoading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold"
              >
                {editLoading ? "Сохранение..." : "Сохранить"}
              </button>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 font-semibold"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default CompanyPage;

