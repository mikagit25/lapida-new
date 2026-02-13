
import React, { useEffect, useState } from 'react';
import TeamForm from './TeamForm';
import TeamListItem from './TeamListItem';
import { useTranslation } from 'react-i18next';
import religiousTeamMemberService from '../services/religiousTeamMemberService';

function ReligiousOrgTeam({ organizationId, isOwner }) {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const initialMember = { name: '', position: '', description: '', contacts: '', photo: '' };
  const [form, setForm] = useState(initialMember);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    religiousTeamMemberService.getAll(organizationId)
      .then(res => setMembers(res.data))
      .catch(() => setError(t('religiousOrgTeam.loadError')))
      .finally(() => setLoading(false));
  }, [organizationId, t]);

  if (selectedMember) {
    return (
      <div className="team-member-detail">
        <button onClick={() => setSelectedMember(null)}> {t('common.backToList')}</button>
        <h2>{selectedMember.name}</h2>
        <div><b>{t('religiousOrgTeam.position')}:</b> {selectedMember.position}</div>
        {selectedMember.photo && (
          <div style={{ margin: '16px 0' }}>
            <img src={selectedMember.photo} alt="member" style={{ maxWidth: 200, borderRadius: 8 }} />
          </div>
        )}
        <div><b>{t('religiousOrgTeam.description')}:</b></div>
        <div style={{ whiteSpace: 'pre-line', marginBottom: 16 }}>{selectedMember.description}</div>
        {selectedMember.contacts && (
          <div><b>{t('religiousOrgTeam.contacts')}:</b> {selectedMember.contacts}</div>
        )}
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let member;
      if (editId) {
        member = { ...form, _id: editId };
        setMembers(members.map(m => (m._id === editId ? member : m)));
        setEditId(null);
      } else {
        member = { ...form, _id: Date.now().toString() };
        setMembers([...members, member]);
      }
      setForm(initialMember);
    } catch (err) {
      console.error('Ошибка сохранения участника команды релорганизации:', err);
      setError(t('religiousOrgTeam.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    setForm(members[idx]);
    setEditId(members[idx]._id);
  };

  const handleDelete = (idx) => {
    setMembers(members.filter((_, i) => i !== idx));
    if (editId === members[idx]._id) setEditId(null);
  };

  return (
    <div className="team-list">
      <h2>{t('religiousOrgTeam.title')}</h2>
      {loading && <div>{t('common.loading')}</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && !error && members.length === 0 && <div>{t('religiousOrgTeam.noMembers')}</div>}
      <TeamForm
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        loading={loading}
        editId={editId}
        onCancel={() => { setForm(initialMember); setEditId(null); }}
        isOwner={isOwner}
        t={t}
      />
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 24, listStyle: 'none', padding: 0 }}>
        {members.map((mb, idx) => (
          <TeamListItem
            key={mb._id || idx}
            member={mb}
            idx={idx}
            isOwner={isOwner}
            onEdit={handleEdit}
            onDelete={handleDelete}
            t={t}
            onSelect={setSelectedMember}
          />
        ))}
      </ul>
    </div>
  );
}

export default ReligiousOrgTeam;
