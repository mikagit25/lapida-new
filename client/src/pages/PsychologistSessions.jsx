import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const PsychologistSessions = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    fetch('/api/psychologist/sessions', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
    })
      .then(res => res.json())
      .then(data => {
        setSessions(data.sessions || []);
        setLoading(false);
      })
      .catch(e => {
        setError(t('sessions_load_error'));
        setLoading(false);
      });
  }, [isAuthenticated, t]);

  if (!isAuthenticated) return <div className="max-w-xl mx-auto py-10 px-4 text-red-600">{t('auth_only')}</div>;

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">{t('psychologist_sessions_title')}</h1>
      {loading && <div>{t('loading')}</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && sessions.length === 0 && <div>{t('no_sessions')}</div>}
      <ul className="space-y-4">
        {sessions.map(session => (
          <li key={session._id} className="border rounded p-3 bg-gray-50">
            <div className="text-xs text-gray-500 mb-1">{new Date(session.updatedAt).toLocaleString()}</div>
            <div className="text-sm">
              {session.messages && session.messages.length > 0
                ? session.messages.slice(-2).map((m, i) => (
                    <div key={i} className={m.role === 'user' ? 'text-blue-700' : 'text-green-700'}>
                      <b>{m.role === 'user' ? t('you') : 'AI'}:</b> {m.content}
                    </div>
                  ))
                : t('no_messages')}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PsychologistSessions;
