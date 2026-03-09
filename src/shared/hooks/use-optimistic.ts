'use client';

import { useState, useCallback } from 'react';

interface OptimisticState<T> {
  data: T;
  isPending: boolean;
  error: Error | null;
  rollback: () => void;
}

interface OptimisticAction<T> {
  action: () => Promise<void>;
  updateFn: (currentData: T) => T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useOptimistic<T>(initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [pendingActions, setPendingActions] = useState<Array<{
    id: string;
    previousData: T;
  }>>([]);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const optimistic = useCallback(async ({
    action,
    updateFn,
    onSuccess,
    onError,
  }: OptimisticAction<T>) => {
    // Store current state for rollback
    const previousData = data;
    const actionId = Math.random().toString(36).substr(2, 9);
    
    // Optimistically update UI
    setData(updateFn(data));
    setIsPending(true);
    setPendingActions(prev => [...prev, { id: actionId, previousData }]);
    setError(null);

    try {
      // Execute actual action
      await action();
      
      // Success - remove from pending
      setPendingActions(prev => prev.filter(a => a.id !== actionId));
      
      // Call success callback
      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err) {
      // Error - rollback
      setData(previousData);
      setPendingActions(prev => prev.filter(a => a.id !== actionId));
      setError(err instanceof Error ? err : new Error('Action failed'));
      
      // Call error callback
      if (onError) {
        onError(err instanceof Error ? err : new Error('Action failed'));
      }
    } finally {
      setIsPending(false);
    }
  }, [data]);

  const rollback = useCallback(() => {
    if (pendingActions.length > 0) {
      const lastAction = pendingActions[pendingActions.length - 1];
      setData(lastAction.previousData);
      setPendingActions(prev => prev.slice(0, -1));
    }
  }, [pendingActions]);

  return {
    data,
    isPending,
    error,
    optimistic,
    rollback,
  };
}

// Helper hook for common optimistic actions
export function useOptimisticList<T extends { id: string }>(initialItems: T[]) {
  const { data: items, optimistic, isPending, error } = useOptimistic(initialItems);

  const addItem = useCallback(async (
    newItem: T,
    action: () => Promise<void>
  ) => {
    await optimistic({
      action,
      updateFn: (current) => [...current, newItem],
    });
  }, [optimistic]);

  const updateItem = useCallback(async (
    itemId: string,
    updates: Partial<T>,
    action: () => Promise<void>
  ) => {
    await optimistic({
      action,
      updateFn: (current) => current.map(item =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    });
  }, [optimistic]);

  const removeItem = useCallback(async (
    itemId: string,
    action: () => Promise<void>
  ) => {
    await optimistic({
      action,
      updateFn: (current) => current.filter(item => item.id !== itemId),
    });
  }, [optimistic]);

  return {
    items,
    isPending,
    error,
    addItem,
    updateItem,
    removeItem,
  };
}
