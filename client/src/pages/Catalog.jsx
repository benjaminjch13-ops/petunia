import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';
import FlowerFilters, { FILTER_KEYS } from '../components/FlowerFilters.jsx';
import FlowerGrid from '../components/FlowerGrid.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { useApi } from '../hooks/useApi.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useMeta, labelOf } from '../hooks/useMeta.js';
import { usePreferences } from '../context/PreferencesContext.jsx';
import { flowerService } from '../services/flowerService.js';

const FLAG_KEYS = ['indoor', 'petSafe'];
const META_LIST = { category: 'categories', color: 'colors', climate: 'climates', season: 'seasons', growth: 'growthTypes', difficulty: 'difficulties' };
const FLAG_LABELS = { indoor: 'Interior', petSafe: 'Segura para mascotas' };

const SORT_OPTIONS = [
  { id: 'name', label: 'Nombre (A–Z)' },
  { id: '-name', label: 'Nombre (Z–A)' },
  { id: 'difficulty', label: 'Más fáciles primero' },
  { id: '-difficulty', label: 'Más exigentes primero' },
];

/** Catálogo universal: búsqueda en vivo + filtros sincronizados con la URL. */
export default function Catalog() {
  const [params, setParams] = useSearchParams();
  const { meta } = useMeta();
  const { hemisphere } = usePreferences();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Texto de búsqueda local (para escribir sin esperar) sincronizado con ?q=
  const [query, setQuery] = useState(params.get('q') || '');
  const debouncedQuery = useDebounce(query, 250);
  useEffect(() => setQuery(params.get('q') || ''), [params]);

  useEffect(() => {
    const current = params.get('q') || '';
    if (debouncedQuery === current) return;
    const next = new URLSearchParams(params);
    if (debouncedQuery) next.set('q', debouncedQuery); else next.delete('q');
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const values = useMemo(() => {
    const v = {};
    FILTER_KEYS.forEach((key) => { v[key] = (params.get(key) || '').split(',').filter(Boolean); });
    FLAG_KEYS.forEach((key) => { v[key] = params.get(key) || ''; });
    return v;
  }, [params]);

  const sort = params.get('sort') || (params.get('q') ? 'relevance' : 'name');
  const activeCount = FILTER_KEYS.reduce((n, k) => n + values[k].length, 0) + FLAG_KEYS.filter((k) => values[k]).length;

  const { data, loading, error, reload } = useApi(
    (signal) => flowerService.list({ ...values, q: params.get('q') || undefined, sort, hemisphere, limit: 100 }, { signal }),
    [params.toString(), hemisphere],
  );

  const updateParam = useCallback((key, nextValue) => {
    const next = new URLSearchParams(params);
    if (Array.isArray(nextValue) ? nextValue.length : nextValue) {
      next.set(key, Array.isArray(nextValue) ? nextValue.join(',') : nextValue);
    } else {
      next.delete(key);
    }
    setParams(next, { replace: true });
  }, [params, setParams]);

  const toggleValue = (key, id) => {
    const list = values[key];
    updateParam(key, list.includes(id) ? list.filter((v) => v !== id) : [...list, id]);
  };

  const clearAll = () => {
    const next = new URLSearchParams();
    if (params.get('q')) next.set('q', params.get('q'));
    setParams(next, { replace: true });
  };

  const chips = meta ? [
    ...FILTER_KEYS.flatMap((key) => values[key].map((id) => ({ key, id, label: labelOf(meta[META_LIST[key]], id) }))),
    ...FLAG_KEYS.filter((k) => values[k]).map((key) => ({ key, id: key, label: FLAG_LABELS[key], flag: true })),
  ] : [];

  const flowers = data?.data || [];
  const total = data?.meta.total ?? 0;

  return (
    <div className="catalog container">
      <SectionHeader
        as="h1"
        eyebrow="Catálogo universal"
        title="Explora el jardín"
        text={meta
          ? `${meta.stats.totalFlowers} especies documentadas hasta ahora. El catálogo crece de forma progresiva con nuevas especies revisadas.`
          : 'Un catálogo en crecimiento con especies revisadas.'}
      />

      <div className="catalog__toolbar">
        <SearchBar value={query} onChange={setQuery} dataTour="search" placeholder="Busca por nombre común o científico…" />
        <div className="catalog__toolbar-row">
          <button type="button" className="btn btn--ghost catalog__filters-toggle" onClick={() => setDrawerOpen(true)} aria-expanded={drawerOpen}>
            ⚙️ Filtros {activeCount > 0 && <span className="pill">{activeCount}</span>}
          </button>
          <label className="select">
            <span className="sr-only">Ordenar por</span>
            <select value={sort === 'relevance' ? '' : sort} onChange={(e) => updateParam('sort', e.target.value)}>
              {params.get('q') && <option value="">Más relevantes</option>}
              {SORT_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="catalog__layout">
        <aside className={`catalog__sidebar ${drawerOpen ? 'is-open' : ''}`} data-tour="filters" aria-label="Filtros del catálogo">
          <div className="catalog__drawer-head">
            <strong>Filtrar flores</strong>
            <button type="button" className="icon-btn" onClick={() => setDrawerOpen(false)} aria-label="Cerrar filtros">×</button>
          </div>
          <FlowerFilters
            meta={meta}
            values={values}
            onToggle={toggleValue}
            onSetFlag={updateParam}
            onClear={clearAll}
            activeCount={activeCount}
          />
          <button type="button" className="btn btn--primary catalog__drawer-apply" onClick={() => setDrawerOpen(false)}>
            Ver {total} {total === 1 ? 'resultado' : 'resultados'}
          </button>
        </aside>
        {drawerOpen && <div className="catalog__scrim" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}

        <section className="catalog__results" aria-live="polite">
          <div className="catalog__summary">
            <p>
              {loading ? 'Buscando flores…' : <><strong>{total}</strong> {total === 1 ? 'flor encontrada' : 'flores encontradas'}</>}
              {params.get('q') && !loading && <> para «{params.get('q')}»</>}
            </p>
            {chips.length > 0 && (
              <ul className="active-chips">
                {chips.map((chip) => (
                  <li key={`${chip.key}-${chip.id}`} className="chip chip--removable">
                    {chip.label}
                    <button
                      type="button"
                      aria-label={`Quitar filtro ${chip.label}`}
                      onClick={() => (chip.flag ? updateParam(chip.key, '') : toggleValue(chip.key, chip.id))}
                    >×</button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {error && <ErrorState error={error} onRetry={reload} />}
          {!error && !loading && flowers.length === 0 && (
            <EmptyState title="No encontramos flores con esos criterios" text="Prueba a quitar algún filtro o a buscar con otro nombre.">
              <button type="button" className="btn btn--primary" onClick={() => { setQuery(''); setParams(new URLSearchParams(), { replace: true }); }}>
                Ver todas las flores
              </button>
            </EmptyState>
          )}
          {!error && (loading || flowers.length > 0) && (
            <FlowerGrid flowers={flowers} loading={loading} tourTarget dataTour="catalog-grid" />
          )}
        </section>
      </div>
    </div>
  );
}
