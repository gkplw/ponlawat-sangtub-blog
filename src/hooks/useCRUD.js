import { useState } from "react";

/**
 * Custom hook for CRUD operations
 * @param {Array} initialData - Initial data array
 * @param {Object} options - Configuration options
 * @returns {Object} CRUD operations and state
 */
export const useCRUD = (initialData = [], options = {}) => {
  const { 
    idField = 'id',
    generateId = () => Date.now(),
    onBeforeCreate,
    onAfterCreate,
    onBeforeUpdate,
    onAfterUpdate,
    onBeforeDelete,
    onAfterDelete
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create operation
  const create = async (newItem) => {
    try {
      setLoading(true);
      setError(null);

      if (onBeforeCreate) {
        const result = await onBeforeCreate(newItem);
        if (result === false) return null;
        newItem = result || newItem;
      }

      const itemWithId = {
        ...newItem,
        [idField]: newItem[idField] || generateId()
      };

      setData(prevData => [...prevData, itemWithId]);

      if (onAfterCreate) {
        await onAfterCreate(itemWithId);
      }

      return itemWithId;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Read operation (get by id)
  const read = (id) => {
    return data.find(item => item[idField] === id);
  };

  // Update operation
  const update = async (id, updatedItem) => {
    try {
      setLoading(true);
      setError(null);

      const existingItem = read(id);
      if (!existingItem) {
        throw new Error(`Item with ${idField} ${id} not found`);
      }

      let finalUpdatedItem = { ...existingItem, ...updatedItem };

      if (onBeforeUpdate) {
        const result = await onBeforeUpdate(finalUpdatedItem, existingItem);
        if (result === false) return null;
        finalUpdatedItem = result || finalUpdatedItem;
      }

      setData(prevData =>
        prevData.map(item =>
          item[idField] === id ? finalUpdatedItem : item
        )
      );

      if (onAfterUpdate) {
        await onAfterUpdate(finalUpdatedItem, existingItem);
      }

      return finalUpdatedItem;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete operation
  const remove = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const existingItem = read(id);
      if (!existingItem) {
        throw new Error(`Item with ${idField} ${id} not found`);
      }

      if (onBeforeDelete) {
        const result = await onBeforeDelete(existingItem);
        if (result === false) return null;
      }

      setData(prevData =>
        prevData.filter(item => item[idField] !== id)
      );

      if (onAfterDelete) {
        await onAfterDelete(existingItem);
      }

      return existingItem;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Bulk operations
  const bulkCreate = async (items) => {
    const results = [];
    for (const item of items) {
      const created = await create(item);
      if (created) results.push(created);
    }
    return results;
  };

  const bulkUpdate = async (updates) => {
    const results = [];
    for (const { id, data: updateData } of updates) {
      const updated = await update(id, updateData);
      if (updated) results.push(updated);
    }
    return results;
  };

  const bulkDelete = async (ids) => {
    const results = [];
    for (const id of ids) {
      const deleted = await remove(id);
      if (deleted) results.push(deleted);
    }
    return results;
  };

  // Utility functions
  const clear = () => setData([]);
  const reset = () => setData(initialData);
  const count = () => data.length;
  const isEmpty = () => data.length === 0;

  return {
    data,
    loading,
    error,
    create,
    read,
    update,
    remove,
    bulkCreate,
    bulkUpdate,
    bulkDelete,
    clear,
    reset,
    count,
    isEmpty,
    setData,
    setLoading,
    setError
  };
};
