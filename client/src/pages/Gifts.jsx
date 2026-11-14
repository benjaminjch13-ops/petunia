import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import FlowerGrid from '../components/FlowerGrid.jsx';
import { EmptyState, ErrorState } from '../components/States.jsx';
import { useApi } from '../hooks/useApi.js';
import { flowerService } from '../services/flowerService.js';

const PET_WARNING = { toxica: ' ⚠️ Tóxica para mascotas.', 'sin-datos': ' ❔ Sin datos sobre mascotas.' };

export default function Gifts() {
  const [petSafe, setPetSafe] = useState(false);
  const [indoor, setIndoor] = useState(false);
  const { data, loading, error, reload } = useApi(
    (signal) => flowerService.list({ giftable: true, petSafe: petSafe || undefined, indoor: indoor || undefined, limit: 100 }, { signal }),
    [petSafe, indoor],
  );
  const flowers = data?.data || [];

  return (
    <div className="container page">
      <SectionHeader
        as="h1"
        eyebrow="Ideas con significado"
        title="Flores ideales para regalar"
        text="Cada flor transmite un mensaje. Comprueba siempre si es segura para las mascotas de quien la recibe."
      />

      <div className="page__toolbar page__toolbar--center">
        <label className="switch">
          <input type="checkbox" checked={petSafe} onChange={(e) => setPetSafe(e.target.checked)} />
          <span className="switch__track" aria-hidden="true" /> Solo seguras para mascotas
        </label>
        <label className="switch">
          <input type="checkbox" checked={indoor} onChange={(e) => setIndoor(e.target.checked)} />
          <span className="switch__track" aria-hidden="true" /> Plantas para interior
        </label>
      </div>

      {error && <ErrorState error={error} onRetry={reload} />}
      {!error && !loading && flowers.length === 0 && (
        <EmptyState title="Ninguna flor cumple esos criterios" text="Prueba a desactivar algún filtro." />
      )}
      {!error && (loading || flowers.length > 0) && (
        <FlowerGrid
          flowers={flowers}
          loading={loading}
          notes={(f) => `🎁 ${f.giftNote || f.shortDescription}${PET_WARNING[f.petToxicity] || ''}`}
        />
      )}
    </div>
  );
}
