import { useEffect, useState } from 'react';
import { getFlowerImage } from '../services/imageService.js';

/** Resuelve la fotografía de una flor solo cuando `enabled` es true (p. ej. al entrar en pantalla). */
export function useFlowerImage(wikiTitle, enabled = true) {
  const [state, setState] = useState({ image: null, loading: Boolean(wikiTitle) });

  useEffect(() => {
    if (!enabled || !wikiTitle) return undefined;
    let active = true;
    getFlowerImage(wikiTitle).then((image) => {
      if (active) setState({ image, loading: false });
    });
    return () => {
      active = false;
    };
  }, [wikiTitle, enabled]);

  return state;
}
