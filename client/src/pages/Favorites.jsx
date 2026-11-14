import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader.jsx';
import FlowerGrid from '../components/FlowerGrid.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { useApi } from '../hooks/useApi.js';
import { flowerService } from '../services/flowerService.js';

export default function Favorites() {
  const { favorites, clearFavorites } = useFavorites();
  const { data, loading, error, reload } = useApi(
    (signal) => flowerService.list({ ids: favorites, limit: 100 }, { signal }),
    [favorites.join(',')],
    { enabled: favorites.length > 0 },
  );

  const onClear = () => {
    if (window.confirm('¿Quieres quitar todas tus flores favoritas?')) clearFavorites();
  };

  return (
    <div className="container page">
      <SectionHeader
        as="h1"
        eyebrow="Tu colección"
        title="Flores favoritas"
        text="Se guardan en este navegador, así que seguirán aquí cuando vuelvas."
      />

      {favorites.length === 0 ? (
        <EmptyState
          title="Tu jardín de favoritas está esperando"
          text="Pulsa el corazón de cualquier flor para guardarla aquí."
          expression="wink"
        >
          <Link to="/catalogo" className="btn btn--primary">Explorar el catálogo</Link>
        </EmptyState>
      ) : (
        <>
          <div className="page__toolbar">
            <p><strong>{favorites.length}</strong> {favorites.length === 1 ? 'flor guardada' : 'flores guardadas'}</p>
            <button type="button" className="btn btn--ghost btn--sm" onClick={onClear}>Vaciar favoritas</button>
          </div>
          {error
            ? <ErrorState error={error} onRetry={reload} />
            : <FlowerGrid flowers={data?.data || []} loading={loading} skeletons={Math.min(favorites.length, 8)} />}
        </>
      )}
    </div>
  );
}
