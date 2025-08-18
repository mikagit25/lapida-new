import React, { useState } from 'react';

export default function DeleteCompanyButton({ companyId, onDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить компанию?')) return;
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        credentials: 'include',
      });
      if (res.ok) {
        if (onDeleted) onDeleted();
      } else {
        const data = await res.json();
        setError(data.message || 'Ошибка удаления');
      }
    } catch (e) {
      setError('Ошибка удаления');
    }
    setLoading(false);
  };

  return (
    <div>
      <button
        className="bg-red-600 text-white px-4 py-2 rounded font-semibold mt-2"
        onClick={handleDelete}
        disabled={loading}
      >
        {loading ? 'Удаление...' : 'Удалить компанию'}
      </button>
      {error && <div className="text-red-600 mt-2 text-sm">{error}</div>}
    </div>
  );
}
