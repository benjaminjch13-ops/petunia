import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('petunia:favorites', []);

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites]);
  const toggleFavorite = useCallback((id) => {
    setFavorites((current) => (current.includes(id) ? current.filter((f) => f !== id) : [...current, id]));
  }, [setFavorites]);
  const clearFavorites = useCallback(() => setFavorites([]), [setFavorites]);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, clearFavorites }),
    [favorites, isFavorite, toggleFavorite, clearFavorites],
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  return context;
}
