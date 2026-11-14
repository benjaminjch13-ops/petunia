import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

const MascotContext = createContext(null);

/**
 * Estado global de Tuni, la mascota:
 *  - bubble: mensaje contextual visible junto al botón flotante.
 *  - panelOpen: panel de ayuda.
 *  - tour: recorrido guiado (activo / paso actual).
 */
export function MascotProvider({ children }) {
  const [bubble, setBubble] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [tour, setTour] = useState({ active: false, step: 0 });
  const [onboarded, setOnboarded] = useLocalStorage('petunia:onboarded', false);
  const [muted, setMuted] = useLocalStorage('petunia:mascot-muted', false);
  const timer = useRef(null);

  const hideBubble = useCallback(() => {
    clearTimeout(timer.current);
    setBubble(null);
  }, []);

  /** Muestra un mensaje: say('texto', { expression, duration, actions }) */
  const say = useCallback((text, { expression = 'happy', duration = 7000, actions, force = false } = {}) => {
    if (muted && !force) return;
    clearTimeout(timer.current);
    setBubble({ text, expression, actions, id: Date.now() });
    if (duration) timer.current = setTimeout(() => setBubble(null), duration);
  }, [muted]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const startTour = useCallback(() => {
    hideBubble();
    setPanelOpen(false);
    setTour({ active: true, step: 0 });
  }, [hideBubble]);

  const endTour = useCallback(() => {
    setTour({ active: false, step: 0 });
    setOnboarded(true);
  }, [setOnboarded]);

  const goToStep = useCallback((step) => setTour((t) => ({ ...t, step })), []);

  const value = useMemo(() => ({
    bubble, say, hideBubble,
    panelOpen, setPanelOpen,
    tour, startTour, endTour, goToStep,
    onboarded, setOnboarded,
    muted, setMuted,
  }), [bubble, say, hideBubble, panelOpen, tour, startTour, endTour, goToStep, onboarded, setOnboarded, muted, setMuted]);

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>;
}

export function useMascot() {
  const context = useContext(MascotContext);
  if (!context) throw new Error('useMascot debe usarse dentro de MascotProvider');
  return context;
}
