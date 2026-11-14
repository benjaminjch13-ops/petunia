import HemisphereToggle from './HemisphereToggle.jsx';

export const FILTER_KEYS = ['category', 'color', 'climate', 'season', 'growth', 'difficulty'];

function ChipGroup({ legend, options, selected, onToggle, renderLabel }) {
  return (
    <fieldset className="filters__group">
      <legend className="filters__legend">{legend}</legend>
      <div className="filters__chips">
        {options.map((option) => {
          const active = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              className={`chip chip--toggle ${active ? 'is-active' : ''}`}
              aria-pressed={active}
              onClick={() => onToggle(option.id)}
              disabled={option.count === 0 && !active}
            >
              {renderLabel ? renderLabel(option) : option.name}
              {typeof option.count === 'number' && <span className="chip__count">{option.count}</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/**
 * Panel de filtros del catálogo.
 * values: { category: [], color: [], climate: [], season: [], growth: [], difficulty: [], indoor, petSafe }
 */
export default function FlowerFilters({ meta, values, onToggle, onSetFlag, onClear, activeCount }) {
  if (!meta) return null;

  return (
    <div className="filters">
      <div className="filters__head">
        <h2 className="filters__title">Filtros</h2>
        {activeCount > 0 && (
          <button type="button" className="btn btn--link btn--sm" onClick={onClear}>Limpiar ({activeCount})</button>
        )}
      </div>

      <ChipGroup
        legend="Categoría"
        options={meta.categories}
        selected={values.category}
        onToggle={(id) => onToggle('category', id)}
        renderLabel={(o) => <><span aria-hidden="true">{o.emoji}</span> {o.name.replace('Flores ', '').replace(/^de /, '')}</>}
      />

      <ChipGroup
        legend="Color"
        options={meta.colors}
        selected={values.color}
        onToggle={(id) => onToggle('color', id)}
        renderLabel={(o) => <><i className="swatch" style={{ background: o.hex }} aria-hidden="true" /> {o.name}</>}
      />

      <ChipGroup legend="Clima" options={meta.climates} selected={values.climate} onToggle={(id) => onToggle('climate', id)} />

      <fieldset className="filters__group">
        <legend className="filters__legend">Temporada de floración</legend>
        <HemisphereToggle compact />
        <div className="filters__chips">
          {meta.seasons.map((s) => {
            const active = values.season.includes(s.id);
            return (
              <button key={s.id} type="button" className={`chip chip--toggle ${active ? 'is-active' : ''}`} aria-pressed={active} onClick={() => onToggle('season', s.id)}>
                {s.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <ChipGroup legend="Tipo de crecimiento" options={meta.growthTypes} selected={values.growth} onToggle={(id) => onToggle('growth', id)} />

      <ChipGroup legend="Dificultad de cuidado" options={meta.difficulties} selected={values.difficulty} onToggle={(id) => onToggle('difficulty', id)} />

      <fieldset className="filters__group">
        <legend className="filters__legend">Más opciones</legend>
        <label className="switch">
          <input type="checkbox" checked={values.indoor === 'true'} onChange={(e) => onSetFlag('indoor', e.target.checked ? 'true' : '')} />
          <span className="switch__track" aria-hidden="true" /> Apta para interior
        </label>
        <label className="switch">
          <input type="checkbox" checked={values.petSafe === 'true'} onChange={(e) => onSetFlag('petSafe', e.target.checked ? 'true' : '')} />
          <span className="switch__track" aria-hidden="true" /> No tóxica para mascotas
        </label>
      </fieldset>
    </div>
  );
}
