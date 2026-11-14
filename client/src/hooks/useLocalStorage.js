import { useCallback, useEffect, useState } from 'react';

/** Estado persistente en localStorage, tolerante a modo privado o bloqueos. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [key, value]);

  // Sincroniza entre pestañas.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== key || event.newValue === null) return;
      try {
        setValue(JSON.parse(event.newValue));
      } catch {
        /* valor corrupto */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const reset = useCallback(() => setValue(initialValue), [initialValue]);
  return [value, setValue, reset];
}
