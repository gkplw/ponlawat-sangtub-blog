/**
 * Utility functions for common filtering operations
 */

/**
 * Filter items by search term (case-insensitive)
 * @param {Array} items - Array of items to filter
 * @param {string} searchTerm - Search term to filter by
 * @param {string|Function} searchField - Field name or function to extract search value
 * @returns {Array} Filtered items
 */
export const filterBySearch = (items, searchTerm, searchField = 'name') => {
  if (!searchTerm.trim()) return items;
  
  const searchLower = searchTerm.toLowerCase();
  
  return items.filter(item => {
    const searchValue = typeof searchField === 'function' 
      ? searchField(item) 
      : item[searchField];
    
    return searchValue && searchValue.toString().toLowerCase().includes(searchLower);
  });
};

/**
 * Filter items by category
 * @param {Array} items - Array of items to filter
 * @param {string} category - Category to filter by ('all' for no filter)
 * @param {string} categoryField - Field name for category
 * @returns {Array} Filtered items
 */
export const filterByCategory = (items, category, categoryField = 'category') => {
  if (!category || category === 'all') return items;
  
  return items.filter(item => item[categoryField] === category);
};

/**
 * Filter items by status
 * @param {Array} items - Array of items to filter
 * @param {string} status - Status to filter by ('all' for no filter)
 * @param {string} statusField - Field name for status
 * @returns {Array} Filtered items
 */
export const filterByStatus = (items, status, statusField = 'status') => {
  if (!status || status === 'all') return items;
  
  return items.filter(item => 
    item[statusField] && item[statusField].toLowerCase() === status.toLowerCase()
  );
};

/**
 * Apply multiple filters to items
 * @param {Array} items - Array of items to filter
 * @param {Object} filters - Object containing filter values
 * @param {Object} config - Configuration for field names
 * @returns {Array} Filtered items
 */
export const applyMultipleFilters = (items, filters, config = {}) => {
  const {
    searchField = 'name',
    categoryField = 'category',
    statusField = 'status'
  } = config;

  let filtered = items;

  if (filters.search) {
    filtered = filterBySearch(filtered, filters.search, searchField);
  }

  if (filters.category) {
    filtered = filterByCategory(filtered, filters.category, categoryField);
  }

  if (filters.status) {
    filtered = filterByStatus(filtered, filters.status, statusField);
  }

  return filtered;
};

/**
 * Truncate text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: ' ...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength, suffix = ' ...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};
