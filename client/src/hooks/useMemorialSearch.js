import { useState, useEffect, useCallback } from 'react';

const useMemorialSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    name: '',
    birthDate: '',
    deathDate: '',
    birthPlace: '',
    burialPlace: '',
    sortBy: 'name',
    sortOrder: 'asc'
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const RESULTS_PER_PAGE = 12;

  // Build search parameters
  const buildSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    
    // Main search query
    if (searchQuery.trim()) {
      params.append('q', searchQuery.trim());
    }

    // Advanced filters
    if (filters.name.trim()) {
      params.append('name', filters.name.trim());
    }
    if (filters.birthDate) {
      params.append('birthDate', filters.birthDate);
    }
    if (filters.deathDate) {
      params.append('deathDate', filters.deathDate);
    }
    if (filters.birthPlace.trim()) {
      params.append('birthPlace', filters.birthPlace.trim());
    }
    if (filters.burialPlace.trim()) {
      params.append('burialPlace', filters.burialPlace.trim());
    }

    // Sorting
    params.append('sortBy', filters.sortBy);
    params.append('sortOrder', filters.sortOrder);

    // Pagination
    params.append('page', currentPage.toString());
    params.append('limit', RESULTS_PER_PAGE.toString());

    return params;
  }, [searchQuery, filters, currentPage]);

  // Perform search
  const performSearch = useCallback(async (resetPage = true) => {
    try {
      setLoading(true);
      setError(null);

      if (resetPage) {
        setCurrentPage(1);
      }

      const params = buildSearchParams();
      if (resetPage) {
        params.set('page', '1');
      }

      const response = await fetch(`/api/memorials/search?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Ошибка поиска: ${response.status}`);
      }

      const data = await response.json();
      
      setResults(data.memorials || []);
      setTotalResults(data.total || 0);
      setHasSearched(true);

      if (resetPage) {
        setCurrentPage(1);
      }

    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'Произошла ошибка при поиске');
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, [buildSearchParams]);

  // Handle search query change
  const handleSearchQueryChange = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Handle filters change
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Reset search
  const resetSearch = useCallback(() => {
    setSearchQuery('');
    setFilters({
      name: '',
      birthDate: '',
      deathDate: '',
      birthPlace: '',
      burialPlace: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });
    setResults([]);
    setTotalResults(0);
    setCurrentPage(1);
    setHasSearched(false);
    setError(null);
  }, []);

  // Auto-search when filters change (debounced)
  useEffect(() => {
    if (!hasSearched && !searchQuery.trim() && !Object.values(filters).some(v => v.trim && v.trim())) {
      return; // Don't auto-search on initial load
    }

    const timer = setTimeout(() => {
      if (searchQuery.trim() || Object.values(filters).some(v => v.trim ? v.trim() : v)) {
        performSearch(true);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchQuery, filters, performSearch, hasSearched]);

  // Search when page changes
  useEffect(() => {
    if (hasSearched && currentPage > 1) {
      performSearch(false);
    }
  }, [currentPage, hasSearched, performSearch]);

  // Calculate pagination info
  const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
  const startResult = (currentPage - 1) * RESULTS_PER_PAGE + 1;
  const endResult = Math.min(currentPage * RESULTS_PER_PAGE, totalResults);

  // Check if search has active filters
  const hasActiveFilters = useCallback(() => {
    return searchQuery.trim() || 
           filters.name.trim() || 
           filters.birthDate || 
           filters.deathDate || 
           filters.birthPlace.trim() || 
           filters.burialPlace.trim();
  }, [searchQuery, filters]);

  // Get search summary
  const getSearchSummary = useCallback(() => {
    if (!hasSearched) return '';
    
    if (totalResults === 0) {
      return hasActiveFilters() ? 'Ничего не найдено' : '';
    }

    const activeFiltersCount = [
      searchQuery.trim(),
      filters.name.trim(),
      filters.birthDate,
      filters.deathDate,
      filters.birthPlace.trim(),
      filters.burialPlace.trim()
    ].filter(Boolean).length;

    if (activeFiltersCount === 0) return '';

    if (totalResults === 1) {
      return `Найден 1 мемориал`;
    } else if (totalResults < 5) {
      return `Найдено ${totalResults} мемориала`;
    } else {
      return `Найдено ${totalResults} мемориалов`;
    }
  }, [hasSearched, totalResults, searchQuery, filters, hasActiveFilters]);

  return {
    // State
    searchQuery,
    filters,
    results,
    loading,
    error,
    totalResults,
    currentPage,
    hasSearched,
    
    // Computed
    totalPages,
    startResult,
    endResult,
    hasActiveFilters: hasActiveFilters(),
    searchSummary: getSearchSummary(),
    
    // Actions
    handleSearchQueryChange,
    handleFiltersChange,
    handlePageChange,
    performSearch,
    resetSearch
  };
};

export default useMemorialSearch;
