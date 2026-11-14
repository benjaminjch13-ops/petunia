import { Link } from 'react-router-dom';
import { MAIN_LINKS, SPECIAL_SECTIONS } from '../data/navigation.js';
import { useMascot } from '../context/MascotContext.jsx';
import BotanicalDecor from './BotanicalDecor.jsx';

export default function Footer() {
  const { startTour } = useMascot();
  return (
    <footer className="footer">
      <BotanicalDecor variant="footer" />
      <div className="container footer__grid">
        <div className="footer__brand">
          <img src="/images/petunia-logo.png" alt="Petunia" className="footer__logo" width="146" height="60" loading="lazy" />
          <p>Una enciclopedia botánica digital para descubrir flores y aprender a hacerlas florecer.</p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={startTour}>🧭 Repetir el recorrido</button>
        </div>
        <nav aria-label="Secciones">
          <h3 className="footer__title">Navegar</h3>
          <ul>
            {MAIN_LINKS.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="Secciones especiales">
          <h3 className="footer__title">Explorar</h3>
          <ul>
            {SPECIAL_SECTIONS.map((s) => <li key={s.to}><Link to={s.to}>{s.label}</Link></li>)}
          </ul>
        </nav>
        <div>
          <h3 className="footer__title">Información</h3>
          <p className="footer__note">
            Contenido divulgativo. Las fotografías provienen de Wikipedia / Wikimedia Commons y la toxicidad para
            mascotas, de la ASPCA. Consulta las <Link to="/acerca">fuentes</Link>.
          </p>
        </div>
      </div>
      <p className="footer__copy">© {new Date().getFullYear()} Petunia · Hecho con 🌸 y JavaScript</p>
    </footer>
  );
}
