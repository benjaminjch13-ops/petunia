import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Vuelve al inicio de la página al cambiar de ruta (no al cambiar filtros). */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}
