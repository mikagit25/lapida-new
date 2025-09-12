import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';


const AdminPaidUsers = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [paid, setPaid] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSetPaid = async () => {
    setLoading(true);
    setResult(null);
    try {
      // Получить пользователя по email
      const resUser = await fetch(`/api/users/by-email/${encodeURIComponent(email)}`);
      const dataUser = await resUser.json();
  if (!dataUser.user || !dataUser.user._id) throw new Error(t('admin_paid_user_not_found'));
      // Установить paid
      const res = await fetch('/api/admin-paid/set-paid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId: dataUser.user._id, paid })
      });
      const data = await res.json();
  if (!res.ok) throw new Error(data.message || t('admin_paid_user_error'));
  setResult({ success: true, message: t('admin_paid_user_status_updated'), user: data.user });
    } catch (e) {
      setResult({ success: false, message: e.message });
    }
    setLoading(false);
  };

  if (!user || user.role !== 'admin') {
  return <div className="max-w-xl mx-auto py-10 px-4 text-red-600">{t('admin_paid_user_no_access')}</div>;
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">{t('admin_paid_user_title')}</h1>
      <div className="mb-4">
        <input
          type="email"
          className="border px-3 py-2 rounded w-full mb-2"
          placeholder={t('admin_paid_user_email_placeholder')}
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label className="inline-flex items-center mr-4">
          <input type="radio" checked={paid} onChange={() => setPaid(true)} />
          <span className="ml-2">{t('admin_paid_user_make_paid')}</span>
        </label>
        <label className="inline-flex items-center">
          <input type="radio" checked={!paid} onChange={() => setPaid(false)} />
          <span className="ml-2">{t('admin_paid_user_make_free')}</span>
        </label>
      </div>
      <button
        className="bg-blue-600 text-white px-6 py-2 rounded font-semibold"
        onClick={handleSetPaid}
        disabled={loading || !email}
      >
        {loading ? t('admin_paid_user_updating') : t('admin_paid_user_update_status')}
      </button>
      {result && (
        <div className={`mt-4 p-2 rounded ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default AdminPaidUsers;
