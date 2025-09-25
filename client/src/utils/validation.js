/**
 * Utility functions for form validation
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push("Password is required");
  } else {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName = "Field") => {
  const isValid = value !== null && value !== undefined && 
                  String(value).trim().length > 0;
  
  return {
    isValid,
    error: isValid ? null : `${fieldName} is required`
  };
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length required
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result
 */
export const validateMinLength = (value, minLength, fieldName = "Field") => {
  const isValid = value && value.length >= minLength;
  
  return {
    isValid,
    error: isValid ? null : `${fieldName} must be at least ${minLength} characters long`
  };
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length allowed
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} Validation result
 */
export const validateMaxLength = (value, maxLength, fieldName = "Field") => {
  const isValid = !value || value.length <= maxLength;
  
  return {
    isValid,
    error: isValid ? null : `${fieldName} must not exceed ${maxLength} characters`
  };
};

/**
 * Validate form fields
 * @param {Object} formData - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result with errors object
 */
export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(rules).forEach(fieldName => {
    const fieldRules = rules[fieldName];
    const fieldValue = formData[fieldName];
    const fieldErrors = [];
    
    fieldRules.forEach(rule => {
      const result = rule(fieldValue, fieldName);
      if (!result.isValid) {
        fieldErrors.push(result.error);
        isValid = false;
      }
    });
    
    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  });
  
  return {
    isValid,
    errors
  };
};
