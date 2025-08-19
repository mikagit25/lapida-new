import React from 'react';
import CustomSlugEditor from './CustomSlugEditor';

export default function CompanyEditForm({ editForm, setEditForm, handleEditCompany, editLoading, editError, editSuccess, company, isOwner }) {
  if (!isOwner) return null;
  return (
    <form className="flex flex-col gap-3 mb-6" onSubmit={handleEditCompany}>
      <input
        className="border px-3 py-2 rounded"
        value={editForm.name}
        onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
        placeholder="Название компании"
      />
      <textarea
        className="border px-3 py-2 rounded"
        value={editForm.description}
        onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
        placeholder="Описание"
      />
      <input
        className="border px-3 py-2 rounded"
        value={editForm.inn || company.inn || ''}
        onChange={e => setEditForm(f => ({ ...f, inn: e.target.value }))}
        placeholder="ИНН"
      />
      <input
        className="border px-3 py-2 rounded"
        value={editForm.extra || company.extra || ''}
        onChange={e => setEditForm(f => ({ ...f, extra: e.target.value }))}
        placeholder="Дополнительная строка (под названием)"
      />
      <CustomSlugEditor
        companyId={company._id}
        initialSlug={company.customSlug}
        isOwner={isOwner}
        companyName={company.name}
        isCabinet={true}
        onSlugSaved={slug => {
          setEditForm(f => ({ ...f, customSlug: slug }));
        }}
      />
      {editError && <div className="text-red-600 text-sm">{editError}</div>}
      {editSuccess && <div className="text-green-600 text-sm">{editSuccess}</div>}
      <button type="submit" disabled={editLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold">
        {editLoading ? 'Сохранение...' : 'Сохранить изменения'}
      </button>
    </form>
  );
}
