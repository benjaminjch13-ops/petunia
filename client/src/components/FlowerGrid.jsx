import FlowerCard from './FlowerCard.jsx';

export function SkeletonCard() {
  return (
    <div className="flower-card flower-card--skeleton" aria-hidden="true">
      <div className="skeleton skeleton--media" />
      <div className="flower-card__body">
        <div className="skeleton skeleton--line" style={{ width: '40%' }} />
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--line" style={{ width: '60%' }} />
        <div className="skeleton skeleton--line" />
        <div className="skeleton skeleton--line" style={{ width: '80%' }} />
      </div>
    </div>
  );
}

/** Rejilla responsive de tarjetas con estado de carga. */
export default function FlowerGrid({ flowers = [], loading = false, skeletons = 8, tourTarget = false, notes, dataTour, compact = false }) {
  return (
    <div className={`flower-grid ${compact ? 'flower-grid--compact' : ''}`} data-tour={dataTour} aria-busy={loading}>
      {loading
        ? Array.from({ length: skeletons }, (_, i) => <SkeletonCard key={i} />)
        : flowers.map((flower, i) => (
          <FlowerCard
            key={flower.id}
            flower={flower}
            index={i}
            tourTarget={tourTarget && i === 0}
            note={notes?.(flower)}
          />
        ))}
    </div>
  );
}
