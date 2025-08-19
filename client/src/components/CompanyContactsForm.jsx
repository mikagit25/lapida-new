import React from 'react';

export default function CompanyContactsForm({ editForm, setEditForm, editLoading, editError, editSuccess, handleEditCompany }) {
  return (
    <div className="mt-6">
      <h3 className="font-semibold text-lg mb-2">Контакты компании</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">Телефоны:</label>
        {(editForm.phones || []).map((phone, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <input
              type="text"
              className="border px-3 py-2 rounded w-full"
              value={phone}
              onChange={e => {
                const phones = [...editForm.phones];
                phones[idx] = e.target.value;
                setEditForm(f => ({ ...f, phones }));
              }}
              placeholder="Телефон"
            />
            <button type="button" className="ml-2 text-xs text-red-600" onClick={() => {
              const phones = [...editForm.phones];
              phones.splice(idx, 1);
              setEditForm(f => ({ ...f, phones }));
            }}>Удалить</button>
          </div>
        ))}
        <button type="button" className="text-xs bg-gray-200 px-2 py-1 rounded" onClick={() => {
          setEditForm(f => ({ ...f, phones: [...(f.phones || []), ''] }));
        }}>Добавить телефон</button>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Email:</label>
        {(editForm.emails || []).map((email, idx) => (
          <div key={idx} className="flex items-center mb-2">
            <input
              type="email"
              className="border px-3 py-2 rounded w-full"
              value={email}
              onChange={e => {
                const emails = [...editForm.emails];
                emails[idx] = e.target.value;
                setEditForm(f => ({ ...f, emails }));
              }}
              placeholder="Email"
            />
            <button type="button" className="ml-2 text-xs text-red-600" onClick={() => {
              const emails = [...editForm.emails];
              emails.splice(idx, 1);
              setEditForm(f => ({ ...f, emails }));
            }}>Удалить</button>
          </div>
        ))}
        <button type="button" className="text-xs bg-gray-200 px-2 py-1 rounded" onClick={() => {
          setEditForm(f => ({ ...f, emails: [...(f.emails || []), ''] }));
        }}>Добавить email</button>
      </div>
      <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" disabled={editLoading} onClick={handleEditCompany}>
        {editLoading ? 'Сохранение...' : 'Сохранить контакты'}
      </button>
      {editError && <div className="text-red-600 text-sm mt-2">{editError}</div>}
      {editSuccess && <div className="text-green-600 text-sm mt-2">{editSuccess}</div>}
    </div>
  );
}
