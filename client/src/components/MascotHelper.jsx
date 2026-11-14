import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Mascot from './Mascot.jsx';
import { useMascot } from '../context/MascotContext.jsx';
import { metaService, flowerService } from '../services/flowerService.js';
import { GREETINGS, MASCOT_NAME, ROUTE_MESSAGES, WELCOME_MESSAGE } from '../data/mascotMessages.js';

const pick = (list) => list[Math.floor(Math.random() * list.length)];

/** Botón flotante de Tuni + burbuja de mensajes + panel de ayuda. */
export default function MascotHelper() {
  const {
    bubble, say, hideBubble, panelOpen, setPanelOpen, tour, startTour,
    onboarded, setOnboarded, muted, setMuted,
  } = useMascot();
  const location = useLocation();
  const navigate = useNavigate();
  const [panelMessage, setPanelMessage] = useState({ text: pick(GREETINGS), expression: 'happy' });
  const [busy, setBusy] = useState(false);
  const seenRoutes = useRef(new Set());
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Bienvenida en la primera visita.
  useEffect(() => {
    if (onboarded || tour.active) return undefined;
    const id = setTimeout(() => {
      say(WELCOME_MESSAGE, {
        expression: 'excited',
        duration: 0,
        force: true,
        actions: [
          { label: 'Sí, enséñame', primary: true, onClick: () => startTour() },
          { label: 'Ahora no', onClick: () => { setOnboarded(true); hideBubble(); } },
        ],
      });
    }, 1200);
    return () => clearTimeout(id);
  }, [onboarded, tour.active, say, startTour, setOnboarded, hideBubble]);

  // Mensaje contextual al entrar por primera vez (en la sesión) a cada sección.
  useEffect(() => {
    if (!onboarded || tour.active) return undefined;
    const path = location.pathname;
    const message = ROUTE_MESSAGES[path];
    if (!message || seenRoutes.current.has(path)) return undefined;
    seenRoutes.current.add(path);
    const id = setTimeout(() => say(message, { expression: 'happy', duration: 6000 }), 900);
    return () => clearTimeout(id);
  }, [location.pathname, onboarded, tour.active, say]);

  // Cerrar el panel con Escape y devolver el foco al botón.
  useEffect(() => {
    if (!panelOpen) return undefined;
    panelRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setPanelOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panelOpen, setPanelOpen]);

  useEffect(() => setPanelOpen(false), [location.pathname, setPanelOpen]);

  if (tour.active) return null;

  const run = async (task) => {
    setBusy(true);
    try {
      await task();
    } catch {
      setPanelMessage({ text: 'Uy, no pude conectar con el jardín. ¿Está en marcha el servidor?', expression: 'surprised' });
    } finally {
      setBusy(false);
    }
  };

  const showTip = () => run(async () => {
    const tip = await metaService.randomTip('tip');
    setPanelMessage({ text: `${tip.icon} ${tip.title}: ${tip.text}`, expression: 'wink' });
  });

  const showCuriosity = () => run(async () => {
    const curiosity = await metaService.randomTip('curiosity');
    setPanelMessage({ text: curiosity.text, expression: 'surprised' });
  });

  const randomFlower = () => run(async () => {
    const flower = await flowerService.random();
    setPanelOpen(false);
    navigate(`/flor/${flower.id}`);
  });

  const dailyFlower = () => run(async () => {
    const flower = await flowerService.daily();
    setPanelOpen(false);
    navigate(`/flor/${flower.id}`);
  });

  const togglePanel = () => {
    hideBubble();
    setPanelOpen(!panelOpen);
  };

  return (
    <div className="mascot-helper">
      {bubble && !panelOpen && (
        <div className="mascot-bubble" role="status" key={bubble.id}>
          <button type="button" className="mascot-bubble__close" onClick={hideBubble} aria-label="Cerrar mensaje">×</button>
          <p>{bubble.text}</p>
          {bubble.actions && (
            <div className="mascot-bubble__actions">
              {bubble.actions.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  className={`btn btn--sm ${action.primary ? 'btn--primary' : 'btn--ghost'}`}
                  onClick={action.onClick}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {panelOpen && (
        <div className="mascot-panel" role="dialog" aria-label={`Ayuda de ${MASCOT_NAME}`} tabIndex={-1} ref={panelRef}>
          <div className="mascot-panel__header">
            <Mascot expression={panelMessage.expression} pose="wave" size={72} />
            <div>
              <h2 className="mascot-panel__title">{MASCOT_NAME}</h2>
              <p className="mascot-panel__subtitle">Tu guía en el jardín</p>
            </div>
            <button type="button" className="icon-btn" onClick={() => setPanelOpen(false)} aria-label="Cerrar panel de ayuda">×</button>
          </div>
          <p className="mascot-panel__message" aria-live="polite">{panelMessage.text}</p>
          <div className="mascot-panel__grid">
            <button type="button" className="mascot-action" onClick={startTour} disabled={busy}>🧭 Recorrido guiado</button>
            <button type="button" className="mascot-action" onClick={showTip} disabled={busy}>💡 Dame un consejo</button>
            <button type="button" className="mascot-action" onClick={showCuriosity} disabled={busy}>✨ Una curiosidad</button>
            <button type="button" className="mascot-action" onClick={randomFlower} disabled={busy}>🎲 Flor sorpresa</button>
            <button type="button" className="mascot-action" onClick={dailyFlower} disabled={busy}>🌞 Flor del día</button>
            <button type="button" className="mascot-action" onClick={() => { setPanelOpen(false); navigate('/catalogo'); }}>🌿 Ir al catálogo</button>
          </div>
          <label className="mascot-panel__mute">
            <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} />
            Silenciar mensajes automáticos
          </label>
        </div>
      )}

      <button
        type="button"
        ref={buttonRef}
        className={`mascot-fab ${panelOpen ? 'is-open' : ''}`}
        onClick={togglePanel}
        aria-expanded={panelOpen}
        aria-label={panelOpen ? `Cerrar ayuda de ${MASCOT_NAME}` : `Abrir ayuda de ${MASCOT_NAME}`}
      >
        <Mascot expression={bubble ? bubble.expression : 'happy'} pose="idle" size={58} headOnly />
      </button>
    </div>
  );
}
