import { useState, useCallback } from "react";

/**
 * Custom hook for form management
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules for form fields
 * @param {Function} onSubmit - Submit handler function
 * @returns {Object} Form state and handlers
 */
export const useForm = (initialValues = {}, validationRules = {}, onSubmit) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  }, [errors]);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  }, []);

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched
    }));
  }, []);

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return null;

    for (const rule of rules) {
      const result = rule(value, name);
      if (!result.isValid) {
        return result.error;
      }
    }
    return null;
  }, [validationRules]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField, validationRules]);

  const handleChange = useCallback((name, value) => {
    setValue(name, value);
    
    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      if (error) {
        setFieldError(name, error);
      }
    }
  }, [setValue, touched, validateField, setFieldError]);

  const handleBlur = useCallback((name) => {
    setFieldTouched(name, true);
    
    // Validate field on blur
    const error = validateField(name, values[name]);
    if (error) {
      setFieldError(name, error);
    }
  }, [setFieldTouched, validateField, values, setFieldError]);

  const handleSubmit = useCallback(async (e) => {
    if (e) {
      e.preventDefault();
    }

    // Mark all fields as touched
    const allFieldsTouched = {};
    Object.keys(validationRules).forEach(fieldName => {
      allFieldsTouched[fieldName] = true;
    });
    setTouched(allFieldsTouched);

    const isValid = validateForm();
    
    if (isValid && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        // You might want to set form-level errors here
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit, validationRules]);

  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const getFieldProps = useCallback((name) => ({
    value: values[name] || '',
    onChange: (e) => {
      const value = e.target ? e.target.value : e;
      handleChange(name, value);
    },
    onBlur: () => handleBlur(name),
    error: touched[name] && errors[name],
  }), [values, handleChange, handleBlur, touched, errors]);

  const isValid = Object.keys(errors).length === 0;
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,
    setValue,
    setFieldError,
    setFieldTouched,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateForm,
    reset,
    getFieldProps
  };
};
