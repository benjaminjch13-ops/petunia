import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import FlowerImage from '../components/FlowerImage.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import CompareButton from '../components/CompareButton.jsx';
import FlowerGrid from '../components/FlowerGrid.jsx';
import MonthStrip from '../components/MonthStrip.jsx';
import HemisphereToggle from '../components/HemisphereToggle.jsx';
import Loader from '../components/Loader.jsx';
import { ErrorState } from '../components/States.jsx';
import { DifficultyBadge, LightBadge, PetBadge, ColorDots } from '../components/Badges.jsx';
import { useApi } from '../hooks/useApi.js';
import { useMeta, labelOf } from '../hooks/useMeta.js';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { useMascot } from '../context/MascotContext.jsx';
import { flowerService } from '../services/flowerService.js';
import { getFlowerGallery } from '../services/imageService.js';
import { LIGHT_MESSAGES, TOXIC_MESSAGE } from '../data/mascotMessages.js';
import { HEMISPHERE_LABELS } from '../data/navigation.js';

const SECTIONS = [
  { id: 'general', label: 'General' },
  { id: 'ambiente', label: 'Ambiente' },
  { id: 'plantacion', label: 'Plantación' },
  { id: 'cuidados', label: 'Cuidados' },
  { id: 'adicional', label: 'Adicional' },
  { id: 'fuentes', label: 'Fuentes' },
];

function InfoItem({ icon, label, children }) {
  if (!children) return null;
  return (
    <div className="info-item">
      <dt><span aria-hidden="true">{icon}</span> {label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Gallery({ flower }) {
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    setImages([]);
    setSelected(null);
    getFlowerGallery(flower.wikiTitle, 6).then((list) => active && setImages(list));
    return () => { active = false; };
  }, [flower.wikiTitle]);

  const current = selected !== null ? images[selected] : null;

  return (
    <div className="gallery">
      <div className="gallery__main">
        {current
          ? <FlowerImage src={current.src} alt={`${flower.commonName}: ${current.caption || 'fotografía'}`} colors={flower.colors} eager key={current.src} />
          : <FlowerImage wikiTitle={flower.wikiTitle} alt={flower.commonName} colors={flower.colors} width={960} eager />}
      </div>
      {images.length > 1 && (
        <ul className="gallery__thumbs" aria-label="Más fotografías">
          <li>
            <button type="button" className={selected === null ? 'is-active' : ''} onClick={() => setSelected(null)} aria-label="Foto principal">
              <FlowerImage wikiTitle={flower.wikiTitle} alt="" colors={flower.colors} width={160} />
            </button>
          </li>
          {images.map((img, i) => (
            <li key={img.src}>
              <button type="button" className={selected === i ? 'is-active' : ''} onClick={() => setSelected(i)} aria-label={`Foto ${i + 2}`}>
                <FlowerImage src={img.src} alt="" colors={flower.colors} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {current?.caption && <p className="gallery__caption">{current.caption}</p>}
      <p className="gallery__credit">
        Fotografías: <a href={flower.sources.find((s) => s.url.includes('wikipedia'))?.url} target="_blank" rel="noreferrer">Wikipedia / Wikimedia Commons</a> (licencias libres; ver autoría en la fuente).
      </p>
    </div>
  );
}

export default function FlowerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { meta } = useMeta();
  const { hemisphere } = usePreferences();
  const { say } = useMascot();
  const [copied, setCopied] = useState(false);

  const { data: flower, loading, error, reload } = useApi((signal) => flowerService.getById(id, { signal }), [id]);
  const related = useApi((signal) => flowerService.getRelated(id, { signal }), [id]);

  useEffect(() => {
    if (!flower) return undefined;
    document.title = `${flower.commonName} (${flower.scientificName}) · Petunia`;
    const timer = setTimeout(() => {
      if (flower.extra.petToxicity.status === 'toxica') {
        say(TOXIC_MESSAGE(flower.commonName), { expression: 'surprised' });
      } else {
        const message = LIGHT_MESSAGES[flower.lightLevel];
        if (message) say(message(flower.commonName), { expression: 'excited' });
      }
    }, 1200);
    return () => {
      clearTimeout(timer);
      document.title = 'Petunia · Enciclopedia de flores';
    };
  }, [flower, say]);

  if (loading) return <Loader label="Abriendo la ficha…" />;
  if (error) {
    return (
      <div className="container section">
        <ErrorState error={error} onRetry={error.status === 404 ? undefined : reload} />
        <p className="center"><Link to="/catalogo" className="btn btn--primary">Volver al catálogo</Link></p>
      </div>
    );
  }

  const calendar = flower.calendar[hemisphere];
  const { environment: env, planting, care, extra } = flower;
  const categoryList = flower.categories.map((c) => meta?.categories.find((x) => x.id === c)).filter(Boolean);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const randomNext = async () => {
    const next = await flowerService.random({ exclude: flower.id });
    navigate(`/flor/${next.id}`);
  };

  return (
    <article className="details">
      <div className="container">
        <nav className="breadcrumb" aria-label="Ruta de navegación">
          <Link to="/">Inicio</Link> <span aria-hidden="true">›</span>
          <Link to="/catalogo">Catálogo</Link> <span aria-hidden="true">›</span>
          <span aria-current="page">{flower.commonName}</span>
        </nav>

        {/* ---------- Cabecera ---------- */}
        <header className="details__hero">
          <Gallery flower={flower} />
          <div className="details__intro fade-up">
            <ul className="tag-list">
              {categoryList.map((c) => (
                <li key={c.id}><Link to={`/catalogo?category=${c.id}`} className="tag">{c.emoji} {c.name}</Link></li>
              ))}
            </ul>
            <h1 className="details__title">{flower.commonName}</h1>
            <p className="details__scientific">{flower.scientificName}</p>
            <p className="details__family">Familia <strong>{flower.family}</strong></p>
            {flower.otherNames?.length > 0 && <p className="details__aka">También conocida como: {flower.otherNames.join(', ')}</p>}
            <p className="details__lead">{flower.shortDescription}</p>
            <div className="badge-row">
              <DifficultyBadge level={flower.difficulty} />
              <LightBadge level={flower.lightLevel} />
              <PetBadge status={extra.petToxicity.status} />
            </div>
            <div className="details__actions">
              <FavoriteButton flower={flower} variant="full" />
              <CompareButton flower={flower} size="md" />
              <button type="button" className="btn btn--ghost" onClick={share}>{copied ? '✓ Enlace copiado' : '🔗 Compartir'}</button>
              <button type="button" className="btn btn--ghost" onClick={randomNext}>🎲 Otra flor</button>
            </div>
          </div>
        </header>

        <nav className="details__nav" aria-label="Secciones de la ficha">
          {SECTIONS.map((s) => <a key={s.id} href={`#${s.id}`}>{s.label}</a>)}
        </nav>

        {/* ---------- Información general ---------- */}
        <section id="general" className="details__section">
          <h2 className="details__heading">🌸 Información general</h2>
          <div className="details__columns">
            <div className="prose">
              <p>{flower.description}</p>
              <h3>Significado y simbolismo</h3>
              <p>{flower.meaning}</p>
            </div>
            <dl className="info-grid">
              <InfoItem icon="🧬" label="Nombre científico"><em>{flower.scientificName}</em></InfoItem>
              <InfoItem icon="🌳" label="Familia botánica">{flower.family}</InfoItem>
              <InfoItem icon="📍" label="Origen geográfico">{flower.origin}</InfoItem>
              <InfoItem icon="🎨" label="Colores disponibles">
                <span className="color-list"><ColorDots colors={flower.colors} max={10} /> {flower.colors.map((c) => labelOf(meta?.colors, c)).join(', ')}</span>
              </InfoItem>
            </dl>
          </div>
          <h3 className="details__subheading">Características físicas</h3>
          <dl className="info-grid info-grid--3">
            <InfoItem icon="📏" label="Altura">{flower.physical?.height}</InfoItem>
            <InfoItem icon="🌼" label="Flores">{flower.physical?.flowers}</InfoItem>
            <InfoItem icon="🍃" label="Hojas">{flower.physical?.leaves}</InfoItem>
          </dl>
          {flower.curiosities?.length > 0 && (
            <div className="curiosities">
              <h3 className="details__subheading">✨ Curiosidades</h3>
              <ul>{flower.curiosities.map((c) => <li key={c}>{c}</li>)}</ul>
            </div>
          )}
        </section>

        {/* ---------- Ambiente y crecimiento ---------- */}
        <section id="ambiente" className="details__section">
          <h2 className="details__heading">🌍 Ambiente y crecimiento</h2>
          <dl className="info-grid info-grid--3">
            <InfoItem icon="🗺️" label="Países o regiones">{flower.regions}</InfoItem>
            <InfoItem icon="🌦️" label="Clima ideal">{env.climate}</InfoItem>
            <InfoItem icon="🌡️" label="Temperatura">{env.temperature}</InfoItem>
            <InfoItem icon="🏠" label="Tipo de suelo">{env.soil}</InfoItem>
            <InfoItem icon="☀️" label="Luz solar">{env.sunlight}</InfoItem>
            <InfoItem icon="💧" label="Humedad ambiental">{env.humidity}</InfoItem>
            <InfoItem icon="⛰️" label="Condiciones especiales">{env.special}</InfoItem>
          </dl>
        </section>

        {/* ---------- Plantación y temporada ---------- */}
        <section id="plantacion" className="details__section">
          <div className="details__heading-row">
            <h2 className="details__heading">🗓️ Plantación y temporada</h2>
            <HemisphereToggle compact />
          </div>
          <div className="season-card card-surface">
            <p className="season-card__title">Calendario orientativo · {HEMISPHERE_LABELS[hemisphere]}</p>
            <MonthStrip planting={calendar.planting} bloom={calendar.bloom} />
            <p className="season-card__note">
              {flower.hemisphereDependent
                ? 'Las temporadas de esta especie se invierten entre hemisferios: cambia el selector para ver tu calendario.'
                : 'Especie de ciclo poco estacional (típico del trópico o del cultivo en interior): el calendario es similar en ambos hemisferios.'}
              {' '}{planting.note}
            </p>
          </div>
          <dl className="info-grid info-grid--3">
            <InfoItem icon="🌱" label="Mejor época para plantar">{planting.season}</InfoItem>
            <InfoItem icon="⏱️" label="Germinación">{planting.germination}</InfoItem>
            <InfoItem icon="📈" label="Tiempo de crecimiento">{planting.growthTime}</InfoItem>
            <InfoItem icon="🔄" label="Época para trasplantar">{planting.transplant}</InfoItem>
            <InfoItem icon="✂️" label="Métodos de propagación">
              <ul className="inline-list">{planting.propagation.map((p) => <li key={p}>{p}</li>)}</ul>
            </InfoItem>
          </dl>
        </section>

        {/* ---------- Guía de cuidados ---------- */}
        <section id="cuidados" className="details__section" data-tour="care">
          <h2 className="details__heading">🌿 Guía de cuidados</h2>
          <div className="care-grid">
            {[
              ['💧', 'Frecuencia de riego', care.watering],
              ['🚿', 'Cantidad de agua', care.waterAmount],
              ['☀️', 'Exposición solar', care.sun],
              ['🧪', 'Fertilizantes', care.fertilizer],
              ['✂️', 'Poda', care.pruning],
              ['🧹', 'Mantenimiento', care.maintenance],
            ].map(([icon, title, text]) => (
              <div key={title} className="care-card">
                <span className="care-card__icon" aria-hidden="true">{icon}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <div className="details__columns">
            <div className="list-card list-card--pests">
              <h3>🐛 Plagas frecuentes</h3>
              <ul>{care.pests.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
            <div className="list-card list-card--diseases">
              <h3>🍂 Enfermedades comunes</h3>
              <ul>{care.diseases.map((d) => <li key={d}>{d}</li>)}</ul>
            </div>
          </div>
          {care.tips?.length > 0 && (
            <div className="tips-box">
              <h3>💚 Consejos para mantenerla saludable</h3>
              <ul>{care.tips.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          )}
        </section>

        {/* ---------- Información adicional ---------- */}
        <section id="adicional" className="details__section">
          <h2 className="details__heading">📋 Información adicional</h2>
          <dl className="info-grid info-grid--3">
            <InfoItem icon="🎯" label="Nivel de dificultad"><DifficultyBadge level={flower.difficulty} /></InfoItem>
            <InfoItem icon="🏠" label="¿Apta para interiores?">{extra.indoor ? 'Sí' : 'No es lo recomendable'}</InfoItem>
            <InfoItem icon="🌳" label="¿Apta para exteriores?">{extra.outdoor ? 'Sí' : 'Solo en climas adecuados o invernadero'}</InfoItem>
            <InfoItem icon="⏳" label="Vida aproximada">{extra.lifespan}</InfoItem>
          </dl>
          <div className="details__columns">
            <div className={`alert alert--${extra.petToxicity.status}`}>
              <h3>🐾 ¿Es tóxica para mascotas?</h3>
              <p><strong>{meta?.petToxicity?.[extra.petToxicity.status]}</strong></p>
              <p>{extra.petToxicity.note}</p>
            </div>
            <div className={`alert alert--edible-${extra.edible.status}`}>
              <h3>🥗 ¿Es comestible?</h3>
              <p><strong>{meta?.edibility?.[extra.edible.status]}</strong></p>
              <p>{extra.edible.note}</p>
            </div>
          </div>
        </section>

        {/* ---------- Fuentes ---------- */}
        <section id="fuentes" className="details__section">
          <h2 className="details__heading">📚 Fuentes de referencia</h2>
          <ul className="sources">
            {flower.sources.map((s) => (
              <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer">{s.name}</a></li>
            ))}
          </ul>
          <p className="disclaimer">
            Información divulgativa y orientativa. Los calendarios y cuidados pueden variar según tu clima, altitud y
            variedad. Ante una posible intoxicación de personas o mascotas, contacta de inmediato con un servicio médico o veterinario.
          </p>
        </section>

        {related.data?.length > 0 && (
          <section className="details__section">
            <h2 className="details__heading">🌿 Flores relacionadas</h2>
            <FlowerGrid flowers={related.data} compact />
          </section>
        )}
      </div>
    </article>
  );
}
