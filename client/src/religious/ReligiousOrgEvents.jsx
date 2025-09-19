import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import religiousEventService from '../services/religiousEventService';

function ReligiousOrgEvents({ organizationId }) {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [registration, setRegistration] = useState({ name: '', email: '', phone: '' });
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    religiousEventService.getAll(organizationId).then(res => setEvents(res.data));
  }, [organizationId]);

  const openEvent = (event) => {
    setSelectedEvent(event);
    setMessage('');
    setRegistration({ name: '', email: '', phone: '' });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      await religiousEventService.register(selectedEvent._id, registration);
      setMessage(t('religiousOrgEvents.registered'));
    } catch (err) {
      setMessage(err.response?.data?.error || t('religiousOrgEvents.registerError'));
    }
    setRegistering(false);
  };

  if (selectedEvent) {
    return (
      <div className="event-detail">
          <button onClick={() => setSelectedEvent(null)}>{t('religiousOrgEvents.backToList')}</button>
        <h2>{selectedEvent.title}</h2>
        <div><b>{t('religiousOrgEvents.date')}:</b> {selectedEvent.date && new Date(selectedEvent.date).toLocaleString()}</div>
        <div><b>{t('religiousOrgEvents.location')}:</b> {selectedEvent.location}</div>
        <div><b>{t('religiousOrgEvents.description')}:</b> {selectedEvent.description}</div>
        {selectedEvent.images && selectedEvent.images.length > 0 && (
          <div className="event-images">
            {selectedEvent.images.map((img, i) => (
              <img key={i} src={img} alt="event" style={{ maxWidth: 200, margin: 4 }} />
            ))}
          </div>
        )}
        {selectedEvent.registrationEnabled && (
          <div className="event-registration">
            <h3>{t('religiousOrgEvents.registrationTitle')}</h3>
            <form onSubmit={handleRegister}>
              <input required placeholder={t('religiousOrgEvents.name')} value={registration.name} onChange={e => setRegistration({ ...registration, name: e.target.value })} />
              <input required placeholder={t('religiousOrgEvents.email')} value={registration.email} onChange={e => setRegistration({ ...registration, email: e.target.value })} />
              <input placeholder={t('religiousOrgEvents.phone')} value={registration.phone} onChange={e => setRegistration({ ...registration, phone: e.target.value })} />
              <button type="submit" disabled={registering}>{t('religiousOrgEvents.registerBtn')}</button>
            </form>
            {message && <div>{message}</div>}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="event-list">
      <h2>{t('religiousOrgEvents.title')}</h2>
      {events.length === 0 && <div>{t('religiousOrgEvents.noEvents')}</div>}
      <ul>
        {events.map(ev => (
          <li key={ev._id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>{ev.title}</div>
            <div>{t('religiousOrgEvents.date')}: {ev.date && new Date(ev.date).toLocaleString()}</div>
            <div>{t('religiousOrgEvents.location')}: {ev.location}</div>
            <button onClick={() => openEvent(ev)}>{t('religiousOrgEvents.detailsBtn')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReligiousOrgEvents;
