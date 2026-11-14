import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Mascot from './Mascot.jsx';
import { useMascot } from '../context/MascotContext.jsx';
import { TOUR_STEPS } from '../data/tourSteps.js';

const PADDING = 8;
const CARD_WIDTH = 340;

/** Calcula la parte visible del elemento resaltado. */
function measure(el) {
  const r = el.getBoundingClientRect();
  const top = Math.max(r.top, PADDING);
  const bottom = Math.min(r.bottom, window.innerHeight - PADDING);
  return {
    top: top - PADDING,
    left: Math.max(r.left - PADDING, 4),
    width: Math.min(r.width + PADDING * 2, window.innerWidth - 8),
    height: Math.max(bottom - top, 40) + PADDING * 2,
  };
}

const CARD_HEIGHT = 250;
const GAP = 14;

/** Coloca la tarjeta debajo, encima, a la derecha o a la izquierda del elemento, según el espacio. */
function cardPosition(rect) {
  if (!rect || window.innerWidth < 640) return null; // centrado / hoja inferior
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const clampLeft = (x) => Math.min(Math.max(x, 12), vw - CARD_WIDTH - 12);
  const clampTop = (y) => Math.min(Math.max(y, 12), vh - CARD_HEIGHT - 12);

  if (vh - (rect.top + rect.height) > CARD_HEIGHT + GAP) return { top: rect.top + rect.height + GAP, left: clampLeft(rect.left) };
  if (rect.top > CARD_HEIGHT + GAP) return { top: rect.top - GAP - CARD_HEIGHT, left: clampLeft(rect.left) };
  if (vw - (rect.left + rect.width) > CARD_WIDTH + GAP) return { top: clampTop(rect.top), left: rect.left + rect.width + GAP };
  if (rect.left > CARD_WIDTH + GAP) return { top: clampTop(rect.top), left: rect.left - GAP - CARD_WIDTH };
  return { top: vh - CARD_HEIGHT - 12, left: vw - CARD_WIDTH - 12 };
}

/** Recorrido guiado paso a paso con foco resaltado sobre la interfaz. */
export default function GuidedTour() {
  const { tour, endTour, goToStep } = useMascot();
  const navigate = useNavigate();
  const location = useLocation();
  const [rect, setRect] = useState(null);
  const cardRef = useRef(null);
  const step = TOUR_STEPS[tour.step];
  const isLast = tour.step === TOUR_STEPS.length - 1;

  const next = useCallback(() => (isLast ? endTour() : goToStep(tour.step + 1)), [isLast, endTour, goToStep, tour.step]);
  const prev = useCallback(() => tour.step > 0 && goToStep(tour.step - 1), [goToStep, tour.step]);

  // Navegar a la página del paso.
  useEffect(() => {
    if (tour.active && step && location.pathname !== step.route) navigate(step.route);
  }, [tour.active, step, location.pathname, navigate]);

  // Localizar el elemento a resaltar (puede tardar en renderizarse).
  useLayoutEffect(() => {
    if (!tour.active || !step) return undefined;
    setRect(null);
    if (!step.target) return undefined;

    let el = null;
    let cancelled = false;
    let tries = 0;
    const timers = [];
    const update = () => !cancelled && el && setRect(measure(el));

    const find = () => {
      if (cancelled) return;
      el = location.pathname === step.route ? document.querySelector(step.target) : null;
      if (el) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        timers.push(setTimeout(update, 450));
      } else if (tries++ < 50) {
        timers.push(setTimeout(find, 100));
      }
    };
    // Pequeña espera para que ScrollToTop (cambio de ruta) no anule nuestro desplazamiento.
    timers.push(setTimeout(find, 150));

    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [tour.active, step, location.pathname]);

  // Teclado y foco.
  useEffect(() => {
    if (!tour.active) return undefined;
    cardRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') endTour();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tour.active, tour.step, endTour, next, prev]);

  if (!tour.active || !step) return null;

  const position = cardPosition(rect);

  return (
    <div className="tour" role="dialog" aria-modal="true" aria-labelledby="tour-title">
      {rect ? (
        <div className="tour__spotlight" style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }} />
      ) : (
        <div className="tour__backdrop" />
      )}
      <div
        ref={cardRef}
        tabIndex={-1}
        className={`tour__card ${position ? 'tour__card--anchored' : 'tour__card--center'}`}
        style={position ? { top: position.top, left: position.left, width: CARD_WIDTH } : undefined}
        key={step.id}
      >
        <div className="tour__mascot">
          <Mascot expression={step.expression} pose={isLast ? 'celebrate' : 'point'} size={70} />
        </div>
        <div className="tour__content">
          <p className="tour__progress">Paso {tour.step + 1} de {TOUR_STEPS.length}</p>
          <h2 id="tour-title" className="tour__title">{step.title}</h2>
          <p className="tour__text">{step.text}</p>
          <div className="tour__dots" aria-hidden="true">
            {TOUR_STEPS.map((s, i) => <span key={s.id} className={i === tour.step ? 'is-active' : ''} />)}
          </div>
          <div className="tour__actions">
            <button type="button" className="btn btn--link" onClick={endTour}>Saltar</button>
            <div className="tour__nav">
              {tour.step > 0 && <button type="button" className="btn btn--ghost btn--sm" onClick={prev}>Atrás</button>}
              <button type="button" className="btn btn--primary btn--sm" onClick={next}>
                {isLast ? '¡A explorar!' : 'Siguiente'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
