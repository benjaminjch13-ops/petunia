import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce.js';
import { flowerService } from '../services/flowerService.js';

/**
 * Buscador de flores.
 * - Modo controlado (value + onChange): filtra en vivo, p. ej. el catálogo.
 * - Modo navegación (sin onChange): muestra sugerencias y al enviar abre el catálogo.
 */
export default function SearchBar({ value, onChange, placeholder = 'Busca una flor: rosa, orquídea, Lavandula…', autoFocus = false, size = 'md', dataTour }) {
  const controlled = typeof onChange === 'function';
  const [internal, setInternal] = useState('');
  const query = controlled ? value : internal;
  const debounced = useDebounce(query, 220);
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const navigate = useNavigate();
  const listId = useId();
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (controlled || debounced.trim().length < 2) {
      setSuggestions([]);
      return undefined;
    }
    const controller = new AbortController();
    flowerService.search(debounced.trim(), 6, { signal: controller.signal })
      .then((data) => {
        setSuggestions(data);
        setActive(-1);
      })
      .catch(() => {});
    return () => controller.abort();
  }, [debounced, controlled]);

  useEffect(() => {
    const onClick = (e) => !wrapperRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const setQuery = (next) => (controlled ? onChange(next) : setInternal(next));

  const goTo = (flower) => {
    setOpen(false);
    navigate(`/flor/${flower.id}`);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (controlled) return;
    if (active >= 0 && suggestions[active]) return goTo(suggestions[active]);
    setOpen(false);
    navigate(query.trim() ? `/catalogo?q=${encodeURIComponent(query.trim())}` : '/catalogo');
  };

  const onKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a <= 0 ? suggestions.length - 1 : a - 1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showList = open && !controlled && suggestions.length > 0;

  return (
    <div className={`search search--${size}`} ref={wrapperRef} data-tour={dataTour}>
      <form role="search" onSubmit={onSubmit} className="search__form">
        <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          className="search__input"
          value={query}
          placeholder={placeholder}
          aria-label="Buscar flores"
          autoComplete="off"
          autoFocus={autoFocus}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
        />
        {query && (
          <button type="button" className="search__clear" onClick={() => setQuery('')} aria-label="Borrar búsqueda">×</button>
        )}
        {!controlled && <button type="submit" className="btn btn--primary search__submit">Buscar</button>}
      </form>
      {showList && (
        <ul className="search__suggestions" id={listId} role="listbox">
          {suggestions.map((flower, i) => (
            <li
              key={flower.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={i === active ? 'is-active' : ''}
              onMouseDown={(e) => {
                e.preventDefault();
                goTo(flower);
              }}
              onMouseEnter={() => setActive(i)}
            >
              <strong>{flower.commonName}</strong>
              <em>{flower.scientificName}</em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
