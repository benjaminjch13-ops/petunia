import { useEffect, useState } from 'react';
import { metaService } from '../services/flowerService.js';

// Caché a nivel de módulo: la taxonomía se pide una sola vez por sesión.
let cache = null;
let pending = null;

function loadMeta() {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = metaService.get()
      .then((data) => {
        cache = data;
        return data;
      })
      .finally(() => {
        pending = null;
      });
  }
  return pending;
}

/** Taxonomía del catálogo (categorías, colores, climas…) con utilidades de etiquetas. */
export function useMeta() {
  const [meta, setMeta] = useState(cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return undefined;
    let active = true;
    loadMeta().then((data) => active && setMeta(data)).catch((err) => active && setError(err));
    return () => {
      active = false;
    };
  }, []);

  return { meta, error, loading: !meta && !error };
}

/** Busca la etiqueta de un id dentro de una lista de la taxonomía. */
export function labelOf(list, id) {
  return list?.find((item) => item.id === id)?.name ?? id;
}
