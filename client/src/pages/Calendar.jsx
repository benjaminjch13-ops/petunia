import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import HemisphereToggle from '../components/HemisphereToggle.jsx';
import Loader from '../components/Loader.jsx';
import { ErrorState } from '../components/States.jsx';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { useApi } from '../hooks/useApi.js';
import { useMeta } from '../hooks/useMeta.js';
import { flowerService } from '../services/flowerService.js';
import { MONTHS, MONTHS_SHORT, HEMISPHERE_LABELS } from '../data/navigation.js';

function MiniList({ title, icon, flowers, empty }) {
  return (
    <div className="month-list card-surface">
      <h3><span aria-hidden="true">{icon}</span> {title} <span className="pill">{flowers.length}</span></h3>
      {flowers.length ? (
        <ul>
          {flowers.map((f) => (
            <li key={f.id}><Link to={`/flor/${f.id}`}>{f.commonName}</Link> <em>{f.scientificName}</em></li>
          ))}
        </ul>
      ) : <p className="muted">{empty}</p>}
    </div>
  );
}

/** Calendario de temporadas de plantación y floración por hemisferio. */
export default function Calendar() {
  const { hemisphere } = usePreferences();
  const { meta } = useMeta();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [category, setCategory] = useState('');

  const all = useApi((signal) => flowerService.list({ sort: 'name', limit: 100, category: category || undefined }, { signal }), [category]);
  const flowers = all.data?.data || [];

  const { plant, bloom } = useMemo(() => ({
    plant: flowers.filter((f) => f.calendar[hemisphere].planting.includes(month)),
    bloom: flowers.filter((f) => f.calendar[hemisphere].bloom.includes(month)),
  }), [flowers, hemisphere, month]);

  return (
    <div className="container page">
      <SectionHeader
        as="h1"
        eyebrow="Planifica tu jardín"
        title="Calendario de temporadas"
        text="Diferencia la época de plantación de la de floración. Las fechas son orientativas y cambian con el clima y la altitud."
      />

      <div className="calendar-controls card-surface">
        <HemisphereToggle />
        <label className="select">
          <span>Mes</span>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </label>
        <label className="select">
          <span>Categoría</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Todas</option>
            {meta?.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
      </div>

      {all.error && <ErrorState error={all.error} onRetry={all.reload} />}
      {all.loading && <Loader label="Preparando el calendario…" />}

      {!all.loading && !all.error && (
        <>
          <h2 className="calendar__month-title">{MONTHS[month - 1]} · {HEMISPHERE_LABELS[hemisphere]}</h2>
          <div className="calendar__lists">
            <MiniList title="Para plantar o sembrar" icon="🌱" flowers={plant} empty="Ninguna flor de esta selección se planta este mes." />
            <MiniList title="En flor" icon="🌸" flowers={bloom} empty="Ninguna flor de esta selección florece este mes." />
          </div>

          <h2 className="details__heading">Vista anual</h2>
          <div className="calendar-table-wrap" tabIndex={0} aria-label="Tabla de calendario anual, desplazable">
            <table className="calendar-table">
              <thead>
                <tr>
                  <th scope="col">Flor</th>
                  {MONTHS_SHORT.map((m, i) => (
                    <th key={m} scope="col" className={i + 1 === month ? 'is-current' : ''}>
                      <button type="button" onClick={() => setMonth(i + 1)} aria-label={`Ver ${MONTHS[i]}`}>{m}</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flowers.map((f) => {
                  const cal = f.calendar[hemisphere];
                  return (
                    <tr key={f.id}>
                      <th scope="row"><Link to={`/flor/${f.id}`}>{f.commonName}</Link></th>
                      {MONTHS_SHORT.map((m, i) => {
                        const p = cal.planting.includes(i + 1);
                        const b = cal.bloom.includes(i + 1);
                        const label = [p && 'plantación', b && 'floración'].filter(Boolean).join(' y ');
                        return (
                          <td key={m} className={`${p ? 'is-plant' : ''} ${b ? 'is-bloom' : ''} ${i + 1 === month ? 'is-current' : ''}`} title={label ? `${MONTHS[i]}: ${label}` : undefined}>
                            <span className="sr-only">{label}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="month-strip__legend">
            <span><i className="legend legend--plant" /> Plantación / siembra</span>
            <span><i className="legend legend--bloom" /> Floración</span>
            <span><i className="legend legend--both" /> Ambas</span>
          </div>
        </>
      )}
    </div>
  );
}
