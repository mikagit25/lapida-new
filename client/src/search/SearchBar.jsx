import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        placeholder="Поиск по мемориалам, пользователям, компаниям..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button type="submit">Найти</button>
    </form>
  );
};

export default SearchBar;
