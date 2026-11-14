import { Link } from 'react-router-dom';
import FlowerImage from './FlowerImage.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import { DifficultyBadge, LightBadge, PetBadge } from './Badges.jsx';
import { useApi } from '../hooks/useApi.js';
import { flowerService } from '../services/flowerService.js';

export default function FlowerOfTheDay() {
  const { data: flower, loading, error } = useApi((signal) => flowerService.daily({ signal }), []);

  if (error) return null;

  return (
    <article className="daily card-surface fade-up" id="flor-del-dia">
      <div className="daily__media">
        {loading ? <div className="skeleton skeleton--media" /> : (
          <FlowerImage wikiTitle={flower.wikiTitle} alt={flower.commonName} colors={flower.colors} width={800} eager />
        )}
        <span className="daily__tag">🌞 Flor del día</span>
      </div>
      <div className="daily__body">
        {loading ? (
          <>
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line" style={{ width: '70%' }} />
          </>
        ) : (
          <>
            <p className="eyebrow">Hoy te presentamos</p>
            <h3 className="daily__title">{flower.commonName}</h3>
            <p className="scientific">{flower.scientificName}</p>
            <p>{flower.shortDescription}</p>
            {flower.curiosities?.[0] && <p className="daily__fact">✨ {flower.curiosities[0]}</p>}
            <div className="badge-row">
              <DifficultyBadge level={flower.difficulty} />
              <LightBadge level={flower.lightLevel} />
              <PetBadge status={flower.extra.petToxicity.status} />
            </div>
            <div className="daily__actions">
              <Link to={`/flor/${flower.id}`} className="btn btn--primary">Conocerla</Link>
              <FavoriteButton flower={flower} variant="full" />
            </div>
          </>
        )}
      </div>
    </article>
  );
}
