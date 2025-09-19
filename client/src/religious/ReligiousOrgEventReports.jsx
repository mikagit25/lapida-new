import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import religiousEventReportService from '../services/religiousEventReportService';

function ReligiousOrgEventReports({ eventId }) {
  const { t } = useTranslation();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    religiousEventReportService.getAll(eventId).then(res => setReports(res.data));
  }, [eventId]);

  if (selectedReport) {
    return (
      <div className="event-report-detail">
        <button onClick={() => setSelectedReport(null)}>← {t('common.backToList')}</button>
        <h2>{selectedReport.title}</h2>
        <div><b>{t('religiousOrgEventReports.event')}:</b> {selectedReport.event?.title}</div>
        <div><b>{t('religiousOrgEventReports.reportDate')}:</b> {selectedReport.createdAt && new Date(selectedReport.createdAt).toLocaleString()}</div>
        <div><b>{t('religiousOrgEventReports.reportText')}:</b></div>
        <div style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>{selectedReport.reportText}</div>
        {selectedReport.images && selectedReport.images.length > 0 && (
          <div className="event-report-images">
            <b>{t('religiousOrgEventReports.photoReport')}:</b>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedReport.images.map((img, i) => (
                <img key={i} src={img} alt="report" style={{ maxWidth: 200, margin: 4 }} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="event-report-list">
      <h2>{t('religiousOrgEventReports.title')}</h2>
      {reports.length === 0 && <div>{t('religiousOrgEventReports.noReports')}</div>}
      <ul>
        {reports.map(rep => (
          <li key={rep._id} style={{ marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
            <div style={{ fontWeight: 'bold', fontSize: 18 }}>{rep.title}</div>
            <div>{t('religiousOrgEventReports.event')}: {rep.event?.title}</div>
            <div>{t('religiousOrgEventReports.date')}: {rep.createdAt && new Date(rep.createdAt).toLocaleString()}</div>
            <button onClick={() => setSelectedReport(rep)}>{t('religiousOrgEventReports.details')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ReligiousOrgEventReports;
