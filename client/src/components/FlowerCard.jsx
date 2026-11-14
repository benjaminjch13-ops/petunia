import { Link } from 'react-router-dom';
import FlowerImage from './FlowerImage.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import CompareButton from './CompareButton.jsx';
import { DifficultyBadge, ColorDots } from './Badges.jsx';
import { useMeta } from '../hooks/useMeta.js';

/** Tarjeta de flor reutilizable para catálogo, favoritas, destacadas, etc. */
export default function FlowerCard({ flower, index = 0, tourTarget = false, note, showCompare = true }) {
  const { meta } = useMeta();
  const category = meta?.categories.find((c) => c.id === flower.categories[0]);
  const url = `/flor/${flower.id}`;

  return (
    <article
      className="flower-card fade-up"
      style={{ '--delay': `${Math.min(index, 12) * 45}ms` }}
      data-tour={tourTarget ? 'flower-card' : undefined}
    >
      <div className="flower-card__media">
        <Link to={url} tabIndex={-1} aria-hidden="true">
          <FlowerImage wikiTitle={flower.wikiTitle} alt={flower.commonName} colors={flower.colors} width={480} />
        </Link>
        <FavoriteButton flower={flower} />
        {flower.featured && <span className="flower-card__ribbon">Destacada</span>}
      </div>
      <div className="flower-card__body">
        {category && (
          <span className="flower-card__category"><span aria-hidden="true">{category.emoji}</span> {category.name}</span>
        )}
        <h3 className="flower-card__title"><Link to={url}>{flower.commonName}</Link></h3>
        <p className="flower-card__scientific">{flower.scientificName}</p>
        <p className="flower-card__desc">{note || flower.shortDescription}</p>
        <div className="flower-card__meta">
          <DifficultyBadge level={flower.difficulty} />
          <ColorDots colors={flower.colors} />
        </div>
        <div className="flower-card__actions">
          <Link to={url} className="btn btn--primary btn--sm">Ver ficha</Link>
          {showCompare && <CompareButton flower={flower} />}
        </div>
      </div>
    </article>
  );
}
