import React, { useState, useEffect, useRef } from 'react';
import { newMemorialService } from '../services/api';
import SearchResults from './SearchResults';
import './Search.css';

const Search = ({ className = '', placeholder = "Поиск мемориалов...", onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');
  const searchTimeout = useRef(null);
  const searchRef = useRef(null);

  // Закрытие результатов при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Очистка таймаута при размонтировании
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Получаем все мемориалы и фильтруем на клиенте
      const allMemorials = await newMemorialService.getAll();
      
      // Фильтрация по различным полям
      const filtered = allMemorials.filter(memorial => {
        const searchLower = searchQuery.toLowerCase();
        return (
          memorial.fullName?.toLowerCase().includes(searchLower) ||
          memorial.name?.toLowerCase().includes(searchLower) ||
          memorial.biography?.toLowerCase().includes(searchLower) ||
          memorial.location?.toLowerCase().includes(searchLower) ||
          memorial.epitaph?.toLowerCase().includes(searchLower)
        );
      });

      setResults(filtered);
      setShowResults(true);
    } catch (err) {
      console.error('Search error:', err);
      setError('Ошибка при поиске. Попробуйте еще раз.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Очищаем предыдущий таймаут
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Устанавливаем новый таймаут для поиска с задержкой
    searchTimeout.current = setTimeout(() => {
      performSearch(value);
    }, 300); // 300ms задержка
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    performSearch(query);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    if (onClose) {
      onClose();
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    setError('');
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          {/* Иконка поиска */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Кнопка очистки */}
          {query && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Индикатор загрузки */}
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </form>

      {/* Результаты поиска */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden">
            {error ? (
              <div className="p-4">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            ) : (
              <SearchResults 
                results={results}
                query={query}
                onClose={handleCloseResults}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
