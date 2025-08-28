import React, { useState } from 'react';
import SearchFilters from '../components/SearchFilters';
import SearchResults from '../components/SearchResults';
import { API_BASE_URL } from '../config/api';

const SearchPage = () => {
  const [filters, setFilters] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE_URL}/search?${params.toString()}`);
      const data = await res.json();
      setResults(data.results || []);
      setQuery(filters.name || filters.query || '');
    } catch (e) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Поиск и фильтрация</h1>
      <SearchFilters onFiltersChange={setFilters} onReset={() => setResults([])} />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? 'Поиск...' : 'Найти'}
      </button>
      <div className="mt-8">
        <SearchResults results={results} query={query} onClose={() => setResults([])} />
      </div>
    </div>
  );
};

export default SearchPage;
