import { createContext, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const PreferencesContext = createContext(null);

/** Preferencias del usuario: hemisferio para calendarios y temporadas. */
export function PreferencesProvider({ children }) {
  const [hemisphere, setHemisphere] = useLocalStorage('petunia:hemisphere', 'north');
  const value = useMemo(() => ({ hemisphere, setHemisphere }), [hemisphere, setHemisphere]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences debe usarse dentro de PreferencesProvider');
  return context;
}
