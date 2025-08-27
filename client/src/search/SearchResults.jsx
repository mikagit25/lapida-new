import React from 'react';

const SearchResults = ({ results }) => {
  if (!results.length) return <div>Ничего не найдено</div>;
  return (
    <ul className="search-results">
      {results.map((item, idx) => (
        <li key={idx}>
          <strong>{item.type}</strong>: {item.name || item.title}
        </li>
      ))}
    </ul>
  );
};

export default SearchResults;
