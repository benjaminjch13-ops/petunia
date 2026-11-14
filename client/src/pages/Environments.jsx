import { useSearchParams } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import FlowerGrid from '../components/FlowerGrid.jsx';
import Loader from '../components/Loader.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { useApi } from '../hooks/useApi.js';
import { useMeta } from '../hooks/useMeta.js';
import { flowerService } from '../services/flowerService.js';

/** Flores recomendadas según el ambiente donde vivirán. */
export default function Environments() {
  const { meta, loading: metaLoading } = useMeta();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('ambiente') || meta?.environments[0]?.id;
  const selected = meta?.environments.find((e) => e.id === selectedId);

  const { data, loading, error, reload } = useApi(
    (signal) => flowerService.list({ environment: selectedId, sort: 'difficulty', limit: 100 }, { signal }),
    [selectedId],
    { enabled: Boolean(selectedId) },
  );

  if (metaLoading) return <Loader />;

  return (
    <div className="container page">
      <SectionHeader as="h1" eyebrow="Recomendaciones" title="Flores para cada ambiente" text="Elige dónde vivirá tu planta y te mostramos las especies que mejor se adaptan, de las más fáciles a las más exigentes." />

      <div className="env-grid" role="tablist" aria-label="Ambientes">
        {meta?.environments.map((env) => (
          <button
            key={env.id}
            type="button"
            role="tab"
            aria-selected={env.id === selectedId}
            className={`env-card ${env.id === selectedId ? 'is-active' : ''}`}
            onClick={() => setParams({ ambiente: env.id }, { replace: true })}
          >
            <span className="env-card__emoji" aria-hidden="true">{env.emoji}</span>
            <strong>{env.name}</strong>
            <small>{env.count} {env.count === 1 ? 'especie' : 'especies'}</small>
          </button>
        ))}
      </div>

      {selected && (
        <div className="env-intro card-surface fade-up" key={selected.id}>
          <span aria-hidden="true">{selected.emoji}</span>
          <div>
            <h2>{selected.name}</h2>
            <p>{selected.description}</p>
          </div>
        </div>
      )}

      {error && <ErrorState error={error} onRetry={reload} />}
      {!error && !loading && data?.data.length === 0 && <EmptyState title="Aún no hay flores para este ambiente" text="Estamos incorporando nuevas especies." />}
      {!error && <FlowerGrid flowers={data?.data || []} loading={loading} />}
    </div>
  );
}
