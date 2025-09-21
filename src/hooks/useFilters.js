import { useState, useMemo } from "react";
import { applyMultipleFilters } from "../utils/filters";

/**
 * Custom hook for managing filters and filtered data
 * @param {Array} data - Data to filter
 * @param {Object} initialFilters - Initial filter values
 * @param {Object} config - Configuration for filter fields
 * @returns {Object} Filter state and filtered data
 */
export const useFilters = (data = [], initialFilters = {}, config = {}) => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    ...initialFilters
  });

  const filteredData = useMemo(() => {
    return applyMultipleFilters(data, filters, config);
  }, [data, filters, config]);

  const updateFilter = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const updateFilters = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      status: 'all',
      ...initialFilters
    });
  };

  const clearFilter = (filterName) => {
    const clearedValue = filterName === 'search' ? '' : 'all';
    updateFilter(filterName, clearedValue);
  };

  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'search') return value.trim() !== '';
      return value !== 'all';
    });
  }, [filters]);

  return {
    filters,
    filteredData,
    updateFilter,
    updateFilters,
    resetFilters,
    clearFilter,
    hasActiveFilters,
    resultsCount: filteredData.length,
    totalCount: data.length
  };
};

/**
 * Custom hook for search functionality
 * @param {Array} data - Data to search
 * @param {string|Function} searchField - Field to search or search function
 * @param {number} debounceMs - Debounce delay in milliseconds
 * @returns {Object} Search state and results
 */
export const useSearch = (data = [], searchField = 'name', debounceMs = 300) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return data;

    const searchLower = debouncedSearchTerm.toLowerCase();
    
    return data.filter(item => {
      const searchValue = typeof searchField === 'function' 
        ? searchField(item) 
        : item[searchField];
      
      return searchValue && searchValue.toString().toLowerCase().includes(searchLower);
    });
  }, [data, debouncedSearchTerm, searchField]);

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    searchResults,
    setSearchTerm,
    clearSearch,
    isSearching: searchTerm !== debouncedSearchTerm,
    hasResults: searchResults.length > 0,
    resultsCount: searchResults.length
  };
};
