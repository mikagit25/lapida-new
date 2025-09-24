import React from 'react';

const OrganizationAvatar = ({ logo, name }) => {
  if (!logo) return null;
  return (
    <div className="flex justify-center md:justify-start mb-4 md:mb-0">
      <img src={logo} alt={name || 'Логотип'} className="w-32 h-32 object-cover rounded-full border shadow" />
    </div>
  );
};

export default OrganizationAvatar;
