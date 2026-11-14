import { useState } from 'react';
import { useInView } from '../hooks/useInView.js';
import { useFlowerImage } from '../hooks/useFlowerImage.js';

const COLOR_HEX = {
  rojo: '#E7848A', rosa: '#F4C6CF', blanco: '#FFFFFF', amarillo: '#F3D98B', naranja: '#F5B98A',
  morado: '#C8B0DA', azul: '#B3CBEA', verde: '#C4CEBE',
};

/** Ilustración de respaldo mientras carga la foto o si no existe. */
function Placeholder({ colors = [] }) {
  const petal = COLOR_HEX[colors[0]] || '#F4C6CF';
  const accent = COLOR_HEX[colors[1]] || '#E8AAB8';
  return (
    <svg className="flower-image__placeholder" viewBox="0 0 100 100" aria-hidden="true">
      <rect width="100" height="100" fill="#FFF8EF" />
      <path d="M50 60 C 48 75, 52 85, 50 100" stroke="#A8B5A0" strokeWidth="3" fill="none" />
      <g transform="translate(50 45)">
        {[0, 60, 120, 180, 240, 300].map((a, i) => (
          <ellipse key={a} rx="9" ry="16" transform={`rotate(${a}) translate(0 -14)`} fill={i % 2 ? accent : petal} stroke="#E8AAB8" strokeWidth="1" />
        ))}
        <circle r="8" fill="#F3D98B" />
      </g>
    </svg>
  );
}

/** Amplía la miniatura de Wikimedia al ancho deseado. */
const sized = (url, width) => (url && width ? url.replace(/\/(\d+)px-/, `/${width}px-`) : url);

/**
 * Fotografía real de la flor con carga progresiva:
 * solo se solicita al entrar en pantalla y aparece con un fundido.
 */
export default function FlowerImage({ wikiTitle, alt, colors, width = 480, className = '', eager = false, src: directSrc }) {
  const [ref, inView] = useInView({ rootMargin: '300px' });
  const { image, loading } = useFlowerImage(directSrc ? null : wikiTitle, eager || inView);
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [failed, setFailed] = useState(false);

  const candidates = directSrc ? [directSrc] : image ? [sized(image.thumb, width), image.thumb] : [];
  const src = candidates[attempt];
  const showImage = src && !failed;

  return (
    <div ref={ref} className={`flower-image ${loaded ? 'is-loaded' : ''} ${loading && !directSrc ? 'is-loading' : ''} ${className}`}>
      <Placeholder colors={colors} />
      {showImage && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => (attempt + 1 < candidates.length ? setAttempt(attempt + 1) : setFailed(true))}
        />
      )}
    </div>
  );
}
