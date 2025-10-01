import { useState, useMemo } from "react";

/**
 * Custom hook for pagination functionality
 * @param {Array} data - Data to paginate
 * @param {number} initialPage - Initial page number (1-based)
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Object} Pagination state and controls
 */
export const usePagination = (data = [], initialPage = 1, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToNextPage = () => goToPage(currentPage + 1);
  const goToPreviousPage = () => goToPage(currentPage - 1);

  const canGoNext = currentPage < totalPages;
  const canGoPrevious = currentPage > 1;

  const getPageNumbers = (maxVisible = 5) => {
    const pages = [];
    const half = Math.floor(maxVisible / 2);
    
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const reset = () => {
    setCurrentPage(initialPage);
  };

  const currentItemsRange = {
    start: totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1,
    end: Math.min(currentPage * itemsPerPage, totalItems)
  };

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedData,
    currentItemsRange,
    canGoNext,
    canGoPrevious,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPreviousPage,
    getPageNumbers,
    reset
  };
};

/**
 * Custom hook for infinite scroll pagination
 * @param {Function} fetchMore - Function to fetch more data
 * @param {Object} options - Configuration options
 * @returns {Object} Infinite scroll state and controls
 */
export const useInfiniteScroll = (fetchMore, options = {}) => {
  const {
    threshold = 100,
    initialLoading = false,
    hasMore: initialHasMore = true
  } = options;

  const [loading, setLoading] = useState(initialLoading);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchMore();
      
      if (result && typeof result === 'object') {
        if ('hasMore' in result) {
          setHasMore(result.hasMore);
        }
      }
    } catch (err) {
      setError(err);
      console.error('Error loading more data:', err);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setHasMore(initialHasMore);
    setError(null);
  };

  // Observer for intersection API
  const observerRef = (node) => {
    if (loading) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (node) observer.observe(node);
    
    return () => {
      if (node) observer.unobserve(node);
    };
  };

  return {
    loading,
    hasMore,
    error,
    loadMore,
    reset,
    observerRef
  };
};
