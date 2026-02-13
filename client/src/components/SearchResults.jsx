import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css';
import { fixImageUrl } from '../utils/imageUrl';

const SearchResults = ({ results, query, onClose }) => {
  const navigate = useNavigate();

  const handleResultClick = (memorial) => {
    onClose();
    navigate(memorial.customSlug ? `/${memorial.customSlug}` : `/memorial/${memorial._id}`);
  };

  if (!results || results.length === 0) {
    return (
      <div className="search-results-container">
        <div className="search-results-header">
          <h3>Результаты поиска</h3>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>
        <div className="no-results">
          <p>По запросу "{query}" ничего не найдено</p>
          <p className="search-tip">Попробуйте изменить критерии поиска</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-results-header">
        <h3>Результаты поиска ({results.length})</h3>
        <button onClick={onClose} className="close-button">
          ✕
        </button>
      </div>
      <div className="search-results-list">
        {results.map((memorial) => (
          <div 
            key={memorial._id} 
            className="search-result-item"
            onClick={() => handleResultClick(memorial)}
          >
            <div className="result-avatar">
              {memorial.photos && memorial.photos.length > 0 ? (
                <img 
                  src={fixImageUrl(`/upload/memorials/${memorial.photos[0]}`)} 
                  alt={memorial.name}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="avatar-placeholder" style={{ display: memorial.photos && memorial.photos.length > 0 ? 'none' : 'flex' }}>
                <span>{memorial.name?.charAt(0) || '?'}</span>
              </div>
            </div>
            <div className="result-info">
              <h4 className="result-name">{memorial.name}</h4>
              <div className="result-dates">
                {memorial.birthDate && (
                  <span className="birth-date">
                    {new Date(memorial.birthDate).toLocaleDateString('ru-RU')}
                  </span>
                )}
                {memorial.birthDate && memorial.deathDate && <span> - </span>}
                {memorial.deathDate && (
                  <span className="death-date">
                    {new Date(memorial.deathDate).toLocaleDateString('ru-RU')}
                  </span>
                )}
              </div>
              {memorial.location && (
                <div className="result-location">
                  📍 {memorial.location}
                </div>
              )}
              {memorial.biography && (
                <div className="result-bio">
                  {memorial.biography.substring(0, 100)}
                  {memorial.biography.length > 100 && '...'}
                </div>
              )}
            </div>
            <div className="result-arrow">
              →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
