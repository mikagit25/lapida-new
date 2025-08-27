import React from 'react';

export default function FamilyMemberForm({ member, onChange, users, memorials }) {
  const safeUsers = Array.isArray(users) ? users : [];
  const safeMemorials = Array.isArray(memorials) ? memorials : [];
  return (
    <div style={{ border: '1px solid #ccc', margin: 8, padding: 8 }}>
      <input
        type="text"
        placeholder="Имя"
        value={member.name || ''}
        onChange={e => onChange({ ...member, name: e.target.value })}
        style={{ marginRight: 8 }}
      />
      <input
        type="text"
        placeholder="Связь"
        value={member.relation || ''}
        onChange={e => onChange({ ...member, relation: e.target.value })}
        style={{ marginRight: 8 }}
      />
      <select
        value={member.userId || ''}
        onChange={e => onChange({ ...member, userId: e.target.value })}
        style={{ marginRight: 8 }}
      >
        <option value="">Привязать к пользователю</option>
        {safeUsers.map(u => (
          <option key={u._id} value={u._id}>{u.name}</option>
        ))}
      </select>
      <select
        value={member.memorialId || ''}
        onChange={e => onChange({ ...member, memorialId: e.target.value })}
      >
        <option value="">Привязать к мемориалу</option>
        {safeMemorials.map(m => (
          <option key={m._id} value={m._id}>{m.title}</option>
        ))}
      </select>
    </div>
  );
}
