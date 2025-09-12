import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { saveErpnextToken, testErpnextConnection } from '../../services/erpnext';
// Можно вынести в config или .env, если нужно централизованно отключать CRM
const CRM_DISABLED = true; // временно отключено

export default function CompanyCrmIntegrationPage() {
  const { id: companyId, companySlug } = useParams();
  const realCompanyId = companyId || companySlug;
  const [status, setStatus] = useState('disconnected');
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setMessage('');
    if (CRM_DISABLED) {
      setMessage('Интеграция с ERPNext временно недоступна.');
      return;
    }
    if (!token) {
      setMessage('Введите API-токен ERPNext');
      return;
    }
    setLoading(true);
    try {
      const saveRes = await saveErpnextToken(realCompanyId, token);
      if (!saveRes.success) {
        setStatus('disconnected');
        setMessage(saveRes.message || 'Ошибка при сохранении токена');
        setLoading(false);
        return;
      }
      const testRes = await testErpnextConnection(realCompanyId);
      if (testRes.success) {
        setStatus('connected');
        setMessage('Интеграция успешно настроена!');
      } else {
        setStatus('disconnected');
        setMessage(testRes.message || 'Ошибка подключения к ERPNext');
      }
    } catch (err) {
      setStatus('disconnected');
      setMessage('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Интеграция с ERPNext CRM</h1>
      {CRM_DISABLED ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
          Интеграция с ERPNext временно отключена. Пожалуйста, обратитесь к администратору или попробуйте позже.
        </div>
      ) : null}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">API-токен ERPNext</label>
        <input
          type="text"
          value={token}
          onChange={e => setToken(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Введите API-токен..."
          disabled={status === 'connected' || loading || CRM_DISABLED}
        />
      </div>
      <button
        onClick={handleConnect}
        className={`bg-blue-600 text-white px-4 py-2 rounded ${loading || CRM_DISABLED ? 'opacity-60 cursor-not-allowed' : ''}`}
        disabled={status === 'connected' || loading || CRM_DISABLED}
      >
        {CRM_DISABLED ? 'CRM отключена' : loading ? 'Проверка...' : status === 'connected' ? 'Подключено' : 'Подключить'}
      </button>
      {message && <div className={`mt-4 ${status === 'connected' ? 'text-green-700' : 'text-red-700'}`}>{message}</div>}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Статус интеграции:</h2>
        <div className={status === 'connected' ? 'text-green-600' : 'text-red-600'}>
          {CRM_DISABLED ? 'CRM временно отключена' : status === 'connected' ? 'Интеграция активна' : 'Нет подключения'}
        </div>
      </div>
    </div>
  );
}
