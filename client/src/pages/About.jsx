import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import Mascot from '../components/Mascot.jsx';
import { useMeta } from '../hooks/useMeta.js';
import { useMascot } from '../context/MascotContext.jsx';

const EXPRESSIONS = [
  { expression: 'happy', pose: 'idle', label: 'Feliz' },
  { expression: 'excited', pose: 'jump', label: 'Emocionada' },
  { expression: 'wink', pose: 'wave', label: 'Saludando' },
  { expression: 'thinking', pose: 'idle', label: 'Pensando' },
  { expression: 'surprised', pose: 'point', label: 'Sorprendida' },
  { expression: 'sleepy', pose: 'still', label: 'Dormilona' },
];

const SOURCES = [
  { name: 'Plants of the World Online — Royal Botanic Gardens, Kew', url: 'https://powo.science.kew.org/', use: 'Nombres científicos, familias y distribución natural.' },
  { name: 'ASPCA Animal Poison Control — plantas tóxicas y no tóxicas', url: 'https://www.aspca.org/pet-care/animal-poison-control/toxic-and-non-toxic-plants', use: 'Toxicidad para perros, gatos y caballos.' },
  { name: 'Wikipedia y Wikimedia Commons', url: 'https://commons.wikimedia.org/', use: 'Fotografías con licencias libres y artículos de referencia.' },
  { name: 'Royal Horticultural Society (RHS)', url: 'https://www.rhs.org.uk/plants', use: 'Referencia general de cultivo y cuidados.' },
  { name: 'Missouri Botanical Garden — Plant Finder', url: 'https://www.missouribotanicalgarden.org/plantfinder/plantfindersearch.aspx', use: 'Referencia general de cultivo y cuidados.' },
];

export default function About() {
  const { meta } = useMeta();
  const { startTour } = useMascot();

  return (
    <div className="container page about">
      <SectionHeader as="h1" eyebrow="Sobre el proyecto" title="Acerca de Petunia" text="Una enciclopedia botánica digital que combina tecnología, diseño y naturaleza." />

      <section className="about__grid">
        <div className="prose card-surface">
          <h2>Nuestra misión</h2>
          <p>
            Petunia nace para que cualquier persona pueda descubrir flores de todo el mundo, entender sus características
            y aprender a cultivarlas y cuidarlas. No solo incluye las flores más populares: también especies tropicales,
            silvestres, acuáticas, desérticas y poco conocidas.
          </p>
          <h2>Un catálogo en crecimiento</h2>
          <p>
            Hoy Petunia documenta <strong>{meta?.stats.totalFlowers ?? '…'} especies</strong> de{' '}
            <strong>{meta?.stats.families ?? '…'} familias botánicas</strong>. No pretende contener todas las especies
            del planeta (se estiman más de 300 000 plantas con flor): el sistema está diseñado para incorporar nuevas
            especies de forma progresiva, cada una revisada con fuentes fiables.
          </p>
        </div>
        <div className="prose card-surface">
          <h2>¿De dónde viene la información?</h2>
          <ul className="sources">
            {SOURCES.map((s) => (
              <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.name}</a><br /><small>{s.use}</small></li>
            ))}
          </ul>
          <p className="disclaimer">
            La información es divulgativa. Cuando no hay datos verificados sobre toxicidad o usos comestibles, lo
            indicamos como «sin datos» en lugar de suponerlo. Ante una intoxicación, consulta con un profesional sanitario o veterinario.
          </p>
        </div>
      </section>

      <section className="about__mascot card-surface">
        <SectionHeader eyebrow="Conoce a nuestra guía" title="Tuni, la compañera de jardín" text="Tuni es una pequeña flor que te acompaña por Petunia: te da la bienvenida, te guía en un recorrido, comparte consejos y te avisa de detalles importantes de cada especie." />
        <ul className="mascot-gallery">
          {EXPRESSIONS.map((e) => (
            <li key={e.label}>
              <Mascot expression={e.expression} pose={e.pose} size={100} title={`Tuni: ${e.label}`} />
              <span>{e.label}</span>
            </li>
          ))}
        </ul>
        <div className="center">
          <button type="button" className="btn btn--primary" onClick={startTour}>🧭 Hacer el recorrido con Tuni</button>
        </div>
      </section>

      <section className="prose card-surface">
        <h2>Tecnología</h2>
        <p>
          Frontend en <strong>React</strong> (Vite + React Router) con estilos en <strong>CSS3</strong>; backend con
          <strong> Node.js</strong> y <strong>Express</strong> que expone una API REST. Los datos se guardan en archivos
          estructurados y validados, preparados para migrar a una base de datos o integrar fuentes botánicas externas.
        </p>
        <p><Link to="/catalogo" className="btn btn--ghost">Explorar el catálogo</Link></p>
      </section>
    </div>
  );
}
