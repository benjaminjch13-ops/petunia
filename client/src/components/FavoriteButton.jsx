import { useFavorites } from '../context/FavoritesContext.jsx';

export default function FavoriteButton({ flower, variant = 'icon' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(flower.id);
  const label = active ? `Quitar ${flower.commonName} de favoritas` : `Añadir ${flower.commonName} a favoritas`;

  return (
    <button
      type="button"
      className={`fav-btn fav-btn--${variant} ${active ? 'is-active' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(flower.id);
      }}
      aria-pressed={active}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" className="fav-btn__icon">
        <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 4.3 2.4h2c.7-1.2 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.2C19.5 16.4 12 21 12 21z" />
      </svg>
      {variant === 'full' && <span>{active ? 'En favoritas' : 'Guardar en favoritas'}</span>}
    </button>
  );
}
