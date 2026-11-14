import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import FlowerImage from '../components/FlowerImage.jsx';
import HemisphereToggle from '../components/HemisphereToggle.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { DifficultyBadge, PetBadge, ColorDots } from '../components/Badges.jsx';
import { useCompare, MAX_COMPARE } from '../context/CompareContext.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { useApi } from '../hooks/useApi.js';
import { useMeta, labelOf } from '../hooks/useMeta.js';
import { flowerService } from '../services/flowerService.js';
import { MONTHS_SHORT, LIGHT_LABELS } from '../data/navigation.js';

const monthsText = (months) => (months.length === 12 ? 'Todo el año' : months.map((m) => MONTHS_SHORT[m - 1]).join(', '));

export default function Compare() {
  const { items, toggleCompare, removeCompare, clearCompare } = useCompare();
  const { hemisphere } = usePreferences();
  const { meta } = useMeta();
  const ids = items.map((i) => i.id);

  const all = useApi((signal) => flowerService.list({ sort: 'name', limit: 100 }, { signal }), []);
  const comparison = useApi(
    (signal) => flowerService.compare(ids, { signal }),
    [ids.join(',')],
    { enabled: ids.length >= 2 },
  );

  const flowers = ids.length >= 2 ? comparison.data || [] : [];
  const options = (all.data?.data || []).filter((f) => !ids.includes(f.id));

  const rows = [
    ['Nombre científico', (f) => <em>{f.scientificName}</em>],
    ['Familia', (f) => f.family],
    ['Origen', (f) => f.origin],
    ['Clima', (f) => f.climates.map((c) => labelOf(meta?.climates, c)).join(', ')],
    ['Temperatura', (f) => f.environment.temperature],
    ['Luz', (f) => `${LIGHT_LABELS[f.lightLevel] || ''}. ${f.care.sun}`],
    ['Riego', (f) => f.care.watering],
    ['Suelo', (f) => f.environment.soil],
    ['Colores', (f) => <ColorDots colors={f.colors} max={8} />],
    ['Floración', (f) => monthsText(f.calendar[hemisphere].bloom)],
    ['Plantación', (f) => monthsText(f.calendar[hemisphere].planting)],
    ['Dificultad', (f) => <DifficultyBadge level={f.difficulty} />],
    ['Interior / exterior', (f) => [f.extra.indoor && 'Interior', f.extra.outdoor && 'Exterior'].filter(Boolean).join(' y ')],
    ['Mascotas', (f) => <PetBadge status={f.extra.petToxicity.status} />],
    ['Propagación', (f) => f.planting.propagation.join(', ')],
    ['Vida aproximada', (f) => f.extra.lifespan],
  ];

  return (
    <div className="container page">
      <SectionHeader as="h1" eyebrow="Herramienta" title="Comparador de flores" text={`Elige hasta ${MAX_COMPARE} flores y compáralas lado a lado.`} />

      <div className="compare-picker card-surface">
        <label className="select select--wide">
          <span>Añadir flor</span>
          <select
            value=""
            disabled={items.length >= MAX_COMPARE || all.loading}
            onChange={(e) => {
              const flower = options.find((f) => f.id === e.target.value);
              if (flower) toggleCompare(flower);
            }}
          >
            <option value="">{items.length >= MAX_COMPARE ? 'Máximo alcanzado' : 'Selecciona una flor…'}</option>
            {options.map((f) => <option key={f.id} value={f.id}>{f.commonName} ({f.scientificName})</option>)}
          </select>
        </label>
        <ul className="compare-picker__chips">
          {items.map((item) => (
            <li key={item.id} className="chip chip--removable">
              {item.commonName}
              <button type="button" onClick={() => removeCompare(item.id)} aria-label={`Quitar ${item.commonName}`}>×</button>
            </li>
          ))}
        </ul>
        <div className="compare-picker__end">
          <HemisphereToggle compact />
          {items.length > 0 && <button type="button" className="btn btn--link btn--sm" onClick={clearCompare}>Vaciar</button>}
        </div>
      </div>

      {ids.length < 2 && (
        <EmptyState
          title={ids.length === 0 ? 'Aún no hay flores para comparar' : 'Añade una flor más'}
          text="Usa el selector de arriba o el botón «Comparar» de cualquier tarjeta del catálogo."
          expression="thinking"
        >
          <Link to="/catalogo" className="btn btn--primary">Ir al catálogo</Link>
        </EmptyState>
      )}

      {comparison.error && <ErrorState error={comparison.error} onRetry={comparison.reload} />}

      {flowers.length >= 2 && (
        <div className="compare-table-wrap">
          <table className="compare-table">
            <thead>
              <tr>
                <th scope="col"><span className="sr-only">Característica</span></th>
                {flowers.map((f) => (
                  <th key={f.id} scope="col">
                    <Link to={`/flor/${f.id}`} className="compare-table__flower">
                      <FlowerImage wikiTitle={f.wikiTitle} alt={f.commonName} colors={f.colors} width={320} />
                      <span>{f.commonName}</span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(([label, render]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  {flowers.map((f) => <td key={f.id}>{render(f)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
