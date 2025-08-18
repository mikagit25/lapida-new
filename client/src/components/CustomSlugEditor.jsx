import React, { useState, useEffect } from 'react';

function translit(str) {
  const ru = ['а','б','в','г','д','е','ё','ж','з','и','й','к','л','м','н','о','п','р','с','т','у','ф','х','ц','ч','ш','щ','ъ','ы','ь','э','ю','я'];
  const en = ['a','b','v','g','d','e','e','zh','z','i','y','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','sch','','y','','e','yu','ya'];
  return str.split('').map(s => {
    const lower = s.toLowerCase();
    const idx = ru.indexOf(lower);
    if (idx >= 0) return en[idx];
    if (/^[a-z0-9]$/i.test(s)) return s.toLowerCase();
    if (s === ' ' || s === '_' || s === '-') return '-';
    return '';
  }).join('').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
}

export default function CustomSlugEditor({ companyId, initialSlug, isOwner, onSlugSaved, companyName }) {
  const [slug, setSlug] = useState(initialSlug || '');
  const [status, setStatus] = useState(''); // '', 'checking', 'available', 'taken', 'error'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSlug(initialSlug || '');
  }, [initialSlug]);

  const checkSlug = async (value) => {
    if (!value) {
      setStatus('');
      return;
    }
    setStatus('checking');
    try {
      const res = await fetch(`/api/companies/check-slug?slug=${value}`);
      const data = await res.json();
      setStatus(data.available ? 'available' : 'taken');
    } catch {
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9-_]/g, '').toLowerCase();
    setSlug(value);
    checkSlug(value);
  };

  const handleFocus = () => {
    if (!slug && companyName) {
      const autoSlug = translit(companyName);
      setSlug(autoSlug);
      checkSlug(autoSlug);
    }
  };

  const handleBlur = () => {
    if (!slug && companyName) {
      const autoSlug = translit(companyName);
      setSlug(autoSlug);
      checkSlug(autoSlug);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      const res = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
        body: JSON.stringify({ customSlug: slug })
      });
      const data = await res.json();
      if (res.ok && data.company) {
        setStatus('available');
        if (onSlugSaved) onSlugSaved(slug);
      } else {
        setError(data.message || 'Ошибка сохранения');
      }
    } catch (e) {
      setError('Ошибка сохранения');
    }
    setLoading(false);
  };

  if (!isOwner) {
    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">Адрес компании (URL)</label>
        <div className="mb-2 text-sm text-gray-600">lapida.one/{slug}</div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block font-medium mb-1">Адрес компании (URL)</label>
      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={slug}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`border px-3 py-2 rounded w-full ${status === 'taken' ? 'border-red-500' : ''}`}
          placeholder="company-name"
          disabled={loading}
        />
        <button
          type="button"
          className="bg-blue-600 text-white px-3 py-2 rounded font-semibold"
          onClick={handleSave}
          disabled={loading || status === 'taken' || !slug}
        >
          {loading ? 'Сохр...' : 'Сохранить'}
        </button>
      </div>
      {status === 'checking' && <span className="text-gray-500 text-sm">Проверка...</span>}
      {status === 'available' && slug && <span className="text-green-600 text-sm">Доступно: lapida.one/{slug}</span>}
      {status === 'taken' && <span className="text-red-600 text-sm">Занято: выберите другое имя</span>}
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
}
