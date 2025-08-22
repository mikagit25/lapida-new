import React from 'react';

const UserPrivacyToggle = ({ user }) => {
  // TODO: implement API call to toggle privacy
  const [isPublic, setIsPublic] = React.useState(user.isPublic || false);
  return (
    <div className="mb-4">
      <label className="font-semibold mr-2">Страница публичная:</label>
      <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(v => !v)} />
    </div>
  );
};

export default UserPrivacyToggle;
