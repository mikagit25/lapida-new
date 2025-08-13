import React from 'react';

const MemorialCard = ({ memorial, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onClick && onClick(memorial)}
    >
      <div className="relative h-48">
        {memorial.profileImage ? (
          <img
            src={fixImageUrl(memorial.profileImage)}
            alt={memorial.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white text-lg font-semibold">{memorial.fullName}</h3>
          <p className="text-white text-sm opacity-90">{memorial.lifespan}</p>
        </div>
      </div>
      
      <div className="p-4">
        {memorial.epitaph && (
          <blockquote className="text-gray-700 italic text-sm mb-3">
            "{memorial.epitaph}"
          </blockquote>
        )}
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Просмотров: {memorial.views || 0}</span>
          <span>{new Date(memorial.createdAt).toLocaleDateString('ru-RU')}</span>
        </div>
      </div>
    </div>
  );
};

export default MemorialCard;
