import React from 'react';
import FamilyMemberForm from './FamilyMemberForm';

export default function FamilyMemberList({ members, onMemberChange, users, memorials }) {
  return (
    <div>
      {members.map((member, idx) => (
        <FamilyMemberForm
          key={idx}
          member={member}
          onChange={m => onMemberChange(idx, m)}
          users={users}
          memorials={memorials}
        />
      ))}
    </div>
  );
}
