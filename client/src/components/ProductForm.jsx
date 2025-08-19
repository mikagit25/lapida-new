import React, { useState, useRef } from 'react';

export default function ProductForm({ initialData, onSave, onCancel }) {
  // Ensure initialData is always an object
  const safeInitialData = initialData && typeof initialData === 'object' ? initialData : {};
  const [form, setForm] = useState({
    name: safeInitialData.name || '',
    description: safeInitialData.description || '',
    price: safeInitialData.price || '',
    category: safeInitialData.category || '',
    tags: safeInitialData.tags ? safeInitialData.tags.join(', ') : '',
    rating: safeInitialData.rating || 0
  });
  const [files, setFiles] = useState([]); // реальные файлы
  const [previews, setPreviews] = useState([]); // превью для отображения
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();

  // Для редактирования: сохранённые фото
  const [existingImages, setExistingImages] = useState(safeInitialData.images || []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    // генерируем превью
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (idx) => {
    setFiles(f => f.filter((_, i) => i !== idx));
    setPreviews(p => p.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingImages(imgs => imgs.filter((_, i) => i !== idx));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Формируем FormData
    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('category', form.category);
    // Теги: строка через запятую -> массив
    const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    fd.append('tags', JSON.stringify(tagsArr));
    fd.append('rating', form.rating);
    // Добавляем оставшиеся сохранённые фото как ссылки
    fd.append('existingImages', JSON.stringify(existingImages));
    // Добавляем новые файлы
    files.forEach(file => fd.append('images', file));
    if (onSave) onSave(fd);
    // Очищаем превью
    previews.forEach(url => URL.revokeObjectURL(url));
    setPreviews([]);
    setFiles([]);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
  <input name="name" value={form.name} onChange={handleChange} placeholder="Название" className="border px-3 py-2 rounded" required />
  <textarea name="description" value={form.description} onChange={handleChange} placeholder="Описание" className="border px-3 py-2 rounded" />
  <input name="price" value={form.price} onChange={handleChange} placeholder="Цена" className="border px-3 py-2 rounded" type="number" min="0" />
  <input name="category" value={form.category} onChange={handleChange} placeholder="Категория" className="border px-3 py-2 rounded" />
  <input name="tags" value={form.tags} onChange={handleChange} placeholder="Теги (через запятую)" className="border px-3 py-2 rounded" />
  <input name="rating" value={form.rating} onChange={handleChange} placeholder="Рейтинг (0-5)" className="border px-3 py-2 rounded" type="number" min="0" max="5" step="0.1" />
      <div>
        <div className="mb-2 font-semibold">Фото товара</div>
        <input type="file" multiple accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelect} />
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded mb-2" onClick={() => fileInputRef.current.click()} disabled={uploading}>
          {uploading ? 'Загрузка...' : 'Добавить фото'}
        </button>
        <div className="flex gap-2 flex-wrap">
          {/* Сохранённые фото */}
          {existingImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={img} alt="Фото" className="w-16 h-16 object-cover rounded border" />
              <button type="button" className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs" onClick={() => handleRemoveExistingImage(idx)} title="Удалить">✕</button>
            </div>
          ))}
          {/* Новые фото */}
          {previews.map((img, idx) => (
            <div key={existingImages.length + idx} className="relative group">
              <img src={img} alt="Фото" className="w-16 h-16 object-cover rounded border" />
              <button type="button" className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs" onClick={() => handleRemoveImage(idx)} title="Удалить">✕</button>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Сохранить</button>
        {onCancel && <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onCancel}>Отмена</button>}
      </div>
    </form>
  );
}
