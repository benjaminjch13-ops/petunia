import { useState } from 'react';
import { Link } from 'react-router-dom';
import FlowerImage from './FlowerImage.jsx';
import Mascot from './Mascot.jsx';
import { flowerService } from '../services/flowerService.js';

/** Descubrimiento aleatorio: muestra una flor sorpresa con animación de giro. */
export default function RandomDiscovery() {
  const [flower, setFlower] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [spin, setSpin] = useState(0);

  const discover = async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await flowerService.random({ exclude: flower?.id });
      setFlower(next);
      setSpin((s) => s + 1);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="discovery card-surface">
      <div className="discovery__intro">
        <Mascot expression={flower ? 'excited' : 'wink'} pose={loading ? 'jump' : 'wave'} size={96} />
        <div>
          <h3 className="discovery__title">¿Te sientes con suerte?</h3>
          <p>Deja que Tuni elija una flor al azar del catálogo.</p>
          <button type="button" className="btn btn--primary" onClick={discover} disabled={loading}>
            {loading ? 'Buscando…' : flower ? '🎲 Otra flor' : '🎲 Sorpréndeme'}
          </button>
          {error && <p className="form-error" role="alert">{error.message}</p>}
        </div>
      </div>

      {flower && (
        <Link to={`/flor/${flower.id}`} className="discovery__result" key={spin}>
          <FlowerImage wikiTitle={flower.wikiTitle} alt={flower.commonName} colors={flower.colors} width={480} eager />
          <div className="discovery__info">
            <strong>{flower.commonName}</strong>
            <em>{flower.scientificName}</em>
            <span>{flower.shortDescription}</span>
            <span className="discovery__cta">Ver ficha →</span>
          </div>
        </Link>
      )}
    </div>
  );
}
