import React, { useState } from 'react';

const emptyProduct = { name: '', description: '', price: '', image: '', available: true };

const OrganizationProductsEdit = ({ products = [], onSave }) => {
  const [list, setList] = useState(products);
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const addProduct = () => {
    if (newProduct.name.trim()) {
      setList([...list, newProduct]);
      setNewProduct(emptyProduct);
    }
  };

  const removeProduct = idx => {
    setList(list.filter((_, i) => i !== idx));
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setNewProduct({ ...newProduct, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await onSave(list);
      setSuccess(true);
    } catch (err) {
      console.error('Ошибка сохранения товаров', err);
      setError('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded shadow p-4 max-w-xl">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">Товары и церковная лавка</h2>
      <div className="flex flex-col md:flex-row gap-2 mb-4">
        <input name="name" value={newProduct.name} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Название товара" />
        <input name="description" value={newProduct.description} onChange={handleChange} className="flex-1 border rounded px-3 py-2" placeholder="Описание" />
        <input name="price" value={newProduct.price} onChange={handleChange} type="number" className="w-28 border rounded px-3 py-2" placeholder="Цена" />
        <input name="image" value={newProduct.image} onChange={handleChange} className="w-48 border rounded px-3 py-2" placeholder="URL изображения" />
        <label className="flex items-center gap-1 text-sm"><input type="checkbox" name="available" checked={newProduct.available} onChange={handleChange} />В наличии</label>
        <button type="button" onClick={addProduct} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Добавить</button>
      </div>
      <ul className="divide-y divide-gray-200 mb-4">
        {list.map((p, i) => (
          <li key={i} className="py-2 flex items-center gap-2">
            {p.image && <img src={p.image} alt="Товар" className="w-16 h-16 object-cover rounded" />}
            <div className="flex-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-gray-600 text-sm">{p.description}</div>
              {p.price && <div className="text-blue-700 font-bold">Цена: {p.price} ₽</div>}
              <div className={p.available ? 'text-green-600' : 'text-red-600'}>{p.available ? 'В наличии' : 'Нет в наличии'}</div>
            </div>
            <button type="button" onClick={() => removeProduct(i)} className="bg-red-600 text-white rounded px-2 py-1 text-xs">✕</button>
          </li>
        ))}
      </ul>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">Сохранено!</div>}
      <button type="button" onClick={handleSave} disabled={saving} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-semibold">
        {saving ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
    </div>
  );
};

export default OrganizationProductsEdit;
