import { Link, useLocation } from 'react-router-dom';
import { useCompare, MAX_COMPARE } from '../context/CompareContext.jsx';

/** Barra flotante con las flores seleccionadas para comparar. */
export default function CompareTray() {
  const { items, removeCompare, clearCompare } = useCompare();
  const location = useLocation();
  if (!items.length || location.pathname === '/comparar') return null;

  return (
    <aside className="compare-tray" aria-label="Flores para comparar">
      <span className="compare-tray__label">⚖️ {items.length}/{MAX_COMPARE}</span>
      <ul className="compare-tray__list">
        {items.map((item) => (
          <li key={item.id} className="chip chip--removable">
            {item.commonName}
            <button type="button" onClick={() => removeCompare(item.id)} aria-label={`Quitar ${item.commonName} del comparador`}>×</button>
          </li>
        ))}
      </ul>
      <div className="compare-tray__actions">
        <button type="button" className="btn btn--link btn--sm" onClick={clearCompare}>Vaciar</button>
        {items.length >= 2
          ? <Link to="/comparar" className="btn btn--primary btn--sm">Comparar</Link>
          : <span className="compare-tray__hint">Elige otra flor</span>}
      </div>
    </aside>
  );
}
