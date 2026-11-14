import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { MAIN_LINKS, SPECIAL_SECTIONS } from '../data/navigation.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { favorites } = useFavorites();
  const location = useLocation();
  const exploreRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setExploreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cerrar el menú «Explorar» al hacer clic fuera o pulsar Escape.
  useEffect(() => {
    if (!exploreOpen) return undefined;
    const onClick = (e) => !exploreRef.current?.contains(e.target) && setExploreOpen(false);
    const onKey = (e) => e.key === 'Escape' && setExploreOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [exploreOpen]);

  const isSpecialActive = SPECIAL_SECTIONS.some((s) => location.pathname.startsWith(s.to));

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand" aria-label="Petunia, ir al inicio">
          <img src="/images/petunia-logo.png" alt="Petunia" className="navbar__logo" width="146" height="60" />
        </Link>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span /><span /><span />
        </button>

        <nav id="main-menu" className={`navbar__menu ${menuOpen ? 'is-open' : ''}`} aria-label="Principal">
          <ul className="navbar__links">
            {MAIN_LINKS.slice(0, 2).map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className="navbar__link">{link.label}</NavLink>
              </li>
            ))}
            <li className="navbar__explore" ref={exploreRef} data-tour="nav-explore">
              <button
                type="button"
                className={`navbar__link navbar__explore-btn ${isSpecialActive ? 'active' : ''}`}
                aria-expanded={exploreOpen}
                aria-haspopup="true"
                onClick={() => setExploreOpen((o) => !o)}
              >
                Explorar <span className="navbar__chevron" aria-hidden="true">▾</span>
              </button>
              <ul className={`navbar__dropdown ${exploreOpen ? 'is-open' : ''}`}>
                {SPECIAL_SECTIONS.map((section) => (
                  <li key={section.to}>
                    <NavLink to={section.to} className="navbar__dropdown-link">
                      <span className="navbar__dropdown-emoji" aria-hidden="true">{section.emoji}</span>
                      <span>
                        <strong>{section.label}</strong>
                        <small>{section.description}</small>
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            {MAIN_LINKS.slice(2).map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="navbar__link">
                  {link.label}
                  {link.to === '/favoritos' && favorites.length > 0 && (
                    <span className="navbar__badge" aria-label={`${favorites.length} favoritas`}>{favorites.length}</span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
