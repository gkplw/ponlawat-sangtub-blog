import { useState } from "react";

/**
 * Custom hook for managing modal state
 * @param {boolean} initialState - Initial state of the modal
 * @returns {Object} Modal state and control functions
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [data, setData] = useState(null);

  const openModal = (modalData = null) => {
    setData(modalData);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setData(null);
  };

  const toggleModal = () => {
    if (isOpen) {
      closeModal();
    } else {
      openModal();
    }
  };

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
  };
};

/**
 * Custom hook for managing multiple modals
 * @param {Array} modalNames - Array of modal names
 * @returns {Object} Object with modal states and controls for each modal
 */
export const useMultipleModals = (modalNames = []) => {
  const modals = {};

  modalNames.forEach(name => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const modal = useModal();
    modals[name] = modal;
  });

  const closeAllModals = () => {
    modalNames.forEach(name => {
      modals[name].closeModal();
    });
  };

  return {
    ...modals,
    closeAllModals,
  };
};
