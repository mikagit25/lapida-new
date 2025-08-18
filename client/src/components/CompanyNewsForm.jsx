import React from 'react';

export default function CompanyNewsForm({ news, setNews, onSave, loading, error, success }) {
  // Добавить новость
  const handleAddNews = () => {
    setNews([...news, { title: '', text: '', image: '', date: new Date() }]);
  };

  // Изменить новость
  const handleChange = (idx, field, value) => {
    const updated = [...news];
    updated[idx][field] = value;
    setNews(updated);
  };

  // Удалить новость
  const handleDelete = idx => {
    const updated = [...news];
    updated.splice(idx, 1);
    setNews(updated);
  };

  return (
    <div>
      <h2 className="font-semibold text-xl mb-4">Новости и акции</h2>
      {news.map((item, idx) => (
        <div key={idx} className="mb-4 border rounded p-3">
          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-2"
            value={item.title}
            onChange={e => handleChange(idx, 'title', e.target.value)}
            placeholder="Заголовок"
          />
          <textarea
            className="border px-3 py-2 rounded w-full mb-2"
            value={item.text}
            onChange={e => handleChange(idx, 'text', e.target.value)}
            placeholder="Текст новости или акции"
          />
          <input
            type="text"
            className="border px-3 py-2 rounded w-full mb-2"
            value={item.image}
            onChange={e => handleChange(idx, 'image', e.target.value)}
            placeholder="Ссылка на изображение (необязательно)"
          />
          <div className="text-xs text-gray-500 mb-2">Дата: {new Date(item.date).toLocaleDateString()}</div>
          <button type="button" className="text-xs text-red-600" onClick={() => handleDelete(idx)}>Удалить</button>
        </div>
      ))}
      <button type="button" className="bg-gray-200 px-4 py-2 rounded font-semibold mb-4" onClick={handleAddNews}>Добавить новость/акцию</button>
      <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" disabled={loading} onClick={onSave}>
        {loading ? 'Сохранение...' : 'Сохранить новости'}
      </button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
    </div>
  );
}
