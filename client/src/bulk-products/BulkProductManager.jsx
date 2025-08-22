import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BulkProductTable from './BulkProductTable';
import BulkProductImport from './BulkProductImport';
import BulkProductActions from './BulkProductActions';

const BulkProductManager = () => {
  // Фильтрация и поиск
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [skuFilter, setSkuFilter] = useState('');
  const [quantityFilter, setQuantityFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');

  // Получить уникальные категории
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));

  // Фильтрация товаров
  const filteredProducts = products.filter(p => {
    return (
      (!search || (p.name && p.name.toLowerCase().includes(search.toLowerCase())) || (p.description && p.description.toLowerCase().includes(search.toLowerCase()))) &&
      (!categoryFilter || p.category === categoryFilter) &&
      (!skuFilter || (p.sku && p.sku.toLowerCase().includes(skuFilter.toLowerCase()))) &&
      (!quantityFilter || (p.quantity !== undefined && String(p.quantity).includes(quantityFilter))) &&
      (!unitFilter || (p.unit && p.unit.toLowerCase().includes(unitFilter.toLowerCase())))
    );
  });

  // Экспорт в CSV
  const handleExportCSV = () => {
    const header = ['Название','Описание','Цена','Категория','Артикул','Остаток','Ед. изм.','Статус','Фото'];
    const rows = filteredProducts.map(p => [
      p.name || '',
      p.description || '',
      p.price || '',
      p.category || '',
      p.sku || '',
      p.quantity || '',
      p.unit || '',
      p.status || '',
      Array.isArray(p.photos) ? p.photos.map(f => typeof f === 'string' ? f : (f.name || '')).join('|') : ''
    ]);
    const csv = [header.join(';'), ...rows.map(r => r.map(x => String(x).replace(/;/g, ',')).join(';'))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]); // индексы выбранных товаров
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Получить companySlug или companyId из URL
  const { companySlug, companyId } = useParams();
  const [resolvedCompanyId, setResolvedCompanyId] = useState(companyId || null);

  // Если есть companySlug, получить companyId через API
  useEffect(() => {
    if (companySlug) {
      setLoading(true);
      setError('');
      fetch(`/api/companies/by-slug/${companySlug}`)
        .then(res => res.json())
        .then(data => {
          if (data.company && data.company._id) {
            setResolvedCompanyId(data.company._id);
          } else {
            setError('Компания не найдена');
            setResolvedCompanyId(null);
          }
        })
        .catch(() => { setError('Ошибка поиска компании'); setResolvedCompanyId(null); })
        .finally(() => setLoading(false));
    } else if (companyId) {
      setResolvedCompanyId(companyId);
    }
  }, [companySlug, companyId]);

  useEffect(() => {
    if (!resolvedCompanyId) return;
    setLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch(`/api/companies/${resolvedCompanyId}/products`, {
      headers,
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
        } else {
          setError('Не удалось загрузить товары');
        }
      })
      .catch(() => setError('Ошибка загрузки товаров'))
      .finally(() => setLoading(false));
  }, [resolvedCompanyId]);

  // Добавление нового товара
  const handleAddProduct = () => {
    setProducts([...products, {
      name: '',
      description: '',
      price: '',
      category: '',
      sku: '',
      quantity: '',
      unit: '',
      status: 'active',
      photos: [],
    }]);
  };

  // Импорт товаров из файла
  const handleImport = (importedProducts) => {
    setProducts([...products, ...importedProducts]);
  };

  // Массовые действия
  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) return;
    const selected = selectedProducts.map(idx => products[idx]);
    setLoading(true);
    if (action === 'delete') {
      // Удалить выбранные (если есть id — запрос на сервер, иначе просто удалить из списка)
      const toDelete = selected.filter(p => p._id);
      for (const prod of toDelete) {
        await fetch(`/api/companies/${resolvedCompanyId}/products/${prod._id}`, { method: 'DELETE' });
      }
      setProducts(products.filter((_, idx) => !selectedProducts.includes(idx)));
      setSelectedProducts([]);
    } else if (action === 'publish') {
      // Опубликовать выбранные (PUT статус)
      for (const prod of selected) {
        let productId = prod._id;
        // Если товар новый, сначала сохраняем
        if (!productId) {
          let res, data;
          const hasFiles = Array.isArray(prod.photos) && prod.photos.some(f => f instanceof File);
          if (hasFiles) {
            const formData = new FormData();
            formData.append('name', prod.name || '');
            formData.append('description', prod.description || '');
            formData.append('price', prod.price || '');
            formData.append('category', prod.category || '');
            formData.append('sku', prod.sku || '');
            formData.append('quantity', prod.quantity || '');
            formData.append('unit', prod.unit || '');
            prod.photos.forEach(file => {
              if (file instanceof File) formData.append('images', file);
            });
            res = await fetch(`/api/companies/${resolvedCompanyId}/products`, {
              method: 'POST',
              body: formData
            });
          } else {
            res = await fetch(`/api/companies/${resolvedCompanyId}/products`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(prod)
            });
          }
          data = await res.json();
          productId = data.product?._id;
        }
        // Публикуем товар (и редактируем фото)
        if (productId) {
          const hasFiles = Array.isArray(prod.photos) && prod.photos.some(f => f instanceof File);
          if (hasFiles) {
            // Отправляем новые фото через FormData, плюс существующие фото
            const formData = new FormData();
            formData.append('status', 'active');
            formData.append('name', prod.name || '');
            formData.append('description', prod.description || '');
            formData.append('price', prod.price || '');
            formData.append('category', prod.category || '');
            formData.append('sku', prod.sku || '');
            formData.append('quantity', prod.quantity || '');
            formData.append('unit', prod.unit || '');
            // Существующие фото (строки)
            const existingImages = prod.photos.filter(f => typeof f === 'string');
            formData.append('existingImages', JSON.stringify(existingImages));
            // Новые фото (File)
            prod.photos.forEach(file => {
              if (file instanceof File) formData.append('images', file);
            });
            await fetch(`/api/companies/${resolvedCompanyId}/products/${productId}`, {
              method: 'PUT',
              body: formData
            });
          } else {
            await fetch(`/api/companies/${resolvedCompanyId}/products/${productId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ status: 'active' })
            });
          }
        }
      }
      // После публикации перезагрузить товары
      const res = await fetch(`/api/companies/${resolvedCompanyId}/products`);
      const data = await res.json();
      setProducts(data.products || []);
      setSelectedProducts([]);
    }
    setLoading(false);
  };

  // Сохранение всех новых товаров
  const handleSaveAll = async () => {
    const newProducts = products.filter(p => !p._id);
    if (newProducts.length === 0) return;
    for (const prod of newProducts) {
      const hasFiles = Array.isArray(prod.photos) && prod.photos.some(f => f instanceof File);
      if (hasFiles) {
        const formData = new FormData();
        formData.append('name', prod.name || '');
            formData.append('description', prod.description || '');
            formData.append('price', prod.price || '');
            formData.append('category', prod.category || '');
            formData.append('sku', prod.sku || '');
            formData.append('quantity', prod.quantity || '');
            formData.append('unit', prod.unit || '');
        prod.photos.forEach(file => {
          if (file instanceof File) formData.append('images', file);
            });
        await fetch(`/api/companies/${resolvedCompanyId}/products`, {
          method: 'POST',
          body: formData
        });
      } else {
        await fetch(`/api/companies/${resolvedCompanyId}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(prod)
        });
      }
    }
    // После сохранения перезагрузить товары
    setLoading(true);
    const res = await fetch(`/api/companies/${resolvedCompanyId}/products`);
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Фильтры и поиск */}
      <div className="flex flex-wrap gap-4 mb-4">
        <input type="text" placeholder="Поиск по названию/описанию" value={search} onChange={e => setSearch(e.target.value)} className="border px-3 py-2 rounded w-48" />
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border px-3 py-2 rounded w-40">
          <option value="">Все категории</option>
          {categories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
        </select>
        <input type="text" placeholder="Артикул" value={skuFilter} onChange={e => setSkuFilter(e.target.value)} className="border px-3 py-2 rounded w-32" />
        <input type="text" placeholder="Остаток" value={quantityFilter} onChange={e => setQuantityFilter(e.target.value)} className="border px-3 py-2 rounded w-24" />
        <input type="text" placeholder="Ед. изм." value={unitFilter} onChange={e => setUnitFilter(e.target.value)} className="border px-3 py-2 rounded w-24" />
        <button type="button" onClick={handleExportCSV} className="bg-yellow-500 text-white px-4 py-2 rounded">Экспорт в CSV</button>
      </div>
      <h2 className="text-2xl font-bold mb-4">Массовое добавление и редактирование товаров</h2>
      <a
        href="/bulk-products-template.csv"
        download="bulk-products-template.csv"
        className="inline-block mb-2 px-4 py-2 bg-green-100 text-green-800 rounded border border-green-300 hover:bg-green-200 font-semibold"
      >
        Скачать шаблон для массового добавления товаров (CSV)
      </a>
      <div className="mb-4 text-sm text-gray-700 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
        <b>Внимание!</b> Если русский текст в шаблоне не отображается корректно в Excel:<br />
        1. Откройте Excel и выберите <b>Данные → Из текста/CSV</b>.<br />
        2. Выберите файл шаблона.<br />
        3. В настройках импорта выберите кодировку <b>65001: Unicode (UTF-8)</b>.<br />
        4. Нажмите "Загрузить".<br />
        Это обеспечит корректное отображение всех языков.
      </div>
      <BulkProductActions onAdd={handleAddProduct} onBulkAction={handleBulkAction} onSaveAll={handleSaveAll} />
      <BulkProductImport onImport={handleImport} />
      {loading ? (
        <div className="text-center py-4">Загрузка товаров...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-600">{error}</div>
      ) : resolvedCompanyId ? (
        <BulkProductTable
          products={filteredProducts}
          setProducts={setProducts}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      ) : (
        <div className="text-center py-4 text-gray-600">Компания не определена. Проверьте адрес страницы.</div>
      )}
    </div>
  );
};

export default BulkProductManager;
