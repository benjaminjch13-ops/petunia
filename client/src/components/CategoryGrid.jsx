import { Link } from 'react-router-dom';
import { useMeta } from '../hooks/useMeta.js';

export default function CategoryGrid() {
  const { meta, loading } = useMeta();

  if (loading) {
    return <div className="category-grid">{Array.from({ length: 12 }, (_, i) => <div key={i} className="category-card skeleton" />)}</div>;
  }
  if (!meta) return null;

  return (
    <div className="category-grid">
      {meta.categories.map((category, i) => (
        <Link
          key={category.id}
          to={`/catalogo?category=${category.id}`}
          className="category-card fade-up"
          style={{ '--delay': `${i * 40}ms` }}
        >
          <span className="category-card__emoji" aria-hidden="true">{category.emoji}</span>
          <span className="category-card__name">{category.name}</span>
          <span className="category-card__count">{category.count} {category.count === 1 ? 'especie' : 'especies'}</span>
        </Link>
      ))}
    </div>
  );
}
