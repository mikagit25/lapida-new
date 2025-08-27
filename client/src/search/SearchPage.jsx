import React, { useState } from 'react';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';
import SearchResults from './SearchResults';

const SearchPage = () => {
  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({ type: '', date: '', status: '' });

  const handleSearch = async (query) => {
    const params = new URLSearchParams({ ...filters, query });
    const res = await fetch(`/api/search?${params}`);
    const data = await res.json();
    setResults(data.results || []);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2>Поиск</h2>
      <SearchBar onSearch={handleSearch} />
      <FilterPanel filters={filters} onChange={handleFilterChange} />
      <SearchResults results={results} />
    </div>
  );
};

export default SearchPage;
