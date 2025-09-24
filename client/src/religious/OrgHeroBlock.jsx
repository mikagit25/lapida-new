import React from 'react';

const OrgHeroBlock = ({ name, description, avatar, background, address, contacts }) => (
  <div className="relative w-full h-64 md:h-96 flex items-center justify-center bg-gray-100 overflow-hidden rounded-xl shadow-lg mb-8">
    {background && (
      <img src={background} alt="background" className="absolute inset-0 w-full h-full object-cover opacity-60" />
    )}
    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-transparent" />
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 bg-white">
        <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow mb-2">{name}</h1>
      <p className="text-lg md:text-xl text-white/90 mb-2 max-w-xl mx-auto drop-shadow">{description}</p>
      {address && <div className="text-white/80 text-sm mb-1">{address}</div>}
      {contacts && (
        <div className="flex gap-4 justify-center text-white/80 text-sm mt-2">
          {contacts.phone && <span>📞 {contacts.phone}</span>}
          {contacts.email && <span>✉️ {contacts.email}</span>}
          {contacts.website && <a href={contacts.website} target="_blank" rel="noopener noreferrer" className="underline">🌐 {contacts.website}</a>}
        </div>
      )}
    </div>
  </div>
);

export default OrgHeroBlock;
