import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export const MAX_COMPARE = 3;
const CompareContext = createContext(null);

/** Selección de flores para el comparador (máximo 3), guardada entre visitas. */
export function CompareProvider({ children }) {
  const [items, setItems] = useLocalStorage('petunia:compare', []);

  const isComparing = useCallback((id) => items.some((i) => i.id === id), [items]);

  /** Devuelve 'added' | 'removed' | 'full'. */
  const toggleCompare = useCallback((flower) => {
    if (items.some((i) => i.id === flower.id)) {
      setItems(items.filter((i) => i.id !== flower.id));
      return 'removed';
    }
    if (items.length >= MAX_COMPARE) return 'full';
    setItems([...items, { id: flower.id, commonName: flower.commonName }]);
    return 'added';
  }, [items, setItems]);

  const removeCompare = useCallback((id) => setItems((c) => c.filter((i) => i.id !== id)), [setItems]);
  const clearCompare = useCallback(() => setItems([]), [setItems]);

  const value = useMemo(() => ({
    items, isComparing, toggleCompare, removeCompare, clearCompare, isFull: items.length >= MAX_COMPARE,
  }), [items, isComparing, toggleCompare, removeCompare, clearCompare]);

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare debe usarse dentro de CompareProvider');
  return context;
}
