import React from 'react';

export default function CompanyLogoUploader({ company, isOwner, setCompany }) {
  if (!isOwner) return null;
  return (
    <form onSubmit={async e => {
      e.preventDefault();
      const file = e.target.logo.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('logo', file);
      const token = localStorage.getItem('authToken');
      const res = await fetch(`/api/companies/${company._id}/logo`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (data.logo) setCompany(prev => ({ ...prev, logo: data.logo }));
    }}>
      <input type="file" name="logo" accept="image/*" className="mb-2" />
      <button type="submit" className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Обновить аватар</button>
    </form>
  );
}
