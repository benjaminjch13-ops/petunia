import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import Mascot from '../components/Mascot.jsx';
import BotanicalDecor from '../components/BotanicalDecor.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import FlowerGrid from '../components/FlowerGrid.jsx';
import FlowerOfTheDay from '../components/FlowerOfTheDay.jsx';
import RandomDiscovery from '../components/RandomDiscovery.jsx';
import CategoryGrid from '../components/CategoryGrid.jsx';
import { ErrorState } from '../components/States.jsx';
import { useApi } from '../hooks/useApi.js';
import { useMeta } from '../hooks/useMeta.js';
import { useMascot } from '../context/MascotContext.jsx';
import { flowerService } from '../services/flowerService.js';
import { SPECIAL_SECTIONS } from '../data/navigation.js';

export default function Home() {
  const featured = useApi((signal) => flowerService.featured({ signal }), []);
  const { meta } = useMeta();
  const { startTour } = useMascot();

  return (
    <div className="home">
      {/* ---------- Bienvenida ---------- */}
      <section className="hero">
        <BotanicalDecor variant="hero" />
        <div className="container hero__inner">
          <div className="hero__copy fade-up">
            <img src="/images/petunia-logo.png" alt="Petunia" className="hero__logo" width="300" height="123" />
            <h1 className="hero__title">Descubre la belleza de cada flor y aprende a hacerla florecer</h1>
            <p className="hero__text">
              Un jardín digital para explorar especies de todo el mundo —tropicales, silvestres, acuáticas,
              desérticas y poco conocidas— y aprender a cultivarlas paso a paso.
            </p>
            <SearchBar size="lg" />
            <div className="hero__actions">
              <Link to="/catalogo" className="btn btn--primary btn--lg">Explorar el catálogo</Link>
              <button type="button" className="btn btn--ghost btn--lg" onClick={startTour}>🧭 Recorrido guiado</button>
            </div>
            {meta && (
              <ul className="hero__stats">
                <li><strong>{meta.stats.totalFlowers}</strong> especies documentadas</li>
                <li><strong>{meta.stats.families}</strong> familias botánicas</li>
                <li><strong>{meta.categories.length}</strong> categorías</li>
              </ul>
            )}
          </div>
          <div className="hero__mascot">
            <div className="hero__halo" aria-hidden="true" />
            <Mascot expression="happy" pose="wave" size={250} />
            <p className="hero__mascot-bubble">¡Hola! Soy <strong>Tuni</strong> 🌸</p>
          </div>
        </div>
      </section>

      {/* ---------- Flor del día ---------- */}
      <section className="section container">
        <FlowerOfTheDay />
      </section>

      {/* ---------- Destacadas ---------- */}
      <section className="section container">
        <SectionHeader eyebrow="Selección del jardín" title="Flores destacadas" text="Especies emblemáticas para empezar a explorar." />
        {featured.error
          ? <ErrorState error={featured.error} onRetry={featured.reload} />
          : <FlowerGrid flowers={featured.data || []} loading={featured.loading} skeletons={4} />}
      </section>

      {/* ---------- Categorías ---------- */}
      <section className="section section--tinted">
        <div className="container">
          <SectionHeader eyebrow="Explora por tipo" title="Categorías de flores" text="Desde el trópico hasta la alta montaña." />
          <CategoryGrid />
        </div>
      </section>

      {/* ---------- Aleatorio ---------- */}
      <section className="section container">
        <SectionHeader eyebrow="Descubrimiento" title="Una flor sorpresa" />
        <RandomDiscovery />
      </section>

      {/* ---------- Secciones especiales ---------- */}
      <section className="section section--tinted">
        <div className="container">
          <SectionHeader eyebrow="Herramientas" title="Secciones especiales" text="Todo lo necesario para elegir, comparar y cuidar tus flores." />
          <div className="specials" data-tour="specials">
            {SPECIAL_SECTIONS.map((s, i) => (
              <Link key={s.to} to={s.to} className="special-card fade-up" style={{ '--delay': `${i * 60}ms` }}>
                <span className="special-card__emoji" aria-hidden="true">{s.emoji}</span>
                <strong>{s.label}</strong>
                <span>{s.description}</span>
              </Link>
            ))}
            <Link to="/favoritos" className="special-card fade-up" style={{ '--delay': '300ms' }}>
              <span className="special-card__emoji" aria-hidden="true">💗</span>
              <strong>Favoritas</strong>
              <span>Tu colección personal, guardada en este dispositivo.</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Llamada al catálogo ---------- */}
      <section className="section container">
        <div className="cta card-surface">
          <Mascot expression="excited" pose="celebrate" size={110} />
          <div>
            <h2 className="cta__title">Un catálogo que sigue creciendo</h2>
            <p>
              Petunia incorpora nuevas especies de forma progresiva, cada una revisada con fuentes botánicas.
              Explora todas las flores disponibles hoy.
            </p>
          </div>
          <Link to="/catalogo" className="btn btn--primary btn--lg">Ver catálogo completo</Link>
        </div>
      </section>
    </div>
  );
}
