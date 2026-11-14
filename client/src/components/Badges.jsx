import { DIFFICULTY_LABELS, LIGHT_LABELS } from '../data/navigation.js';

export function DifficultyBadge({ level }) {
  const dots = { facil: 1, intermedio: 2, avanzado: 3 }[level] || 1;
  return (
    <span className={`badge badge--difficulty badge--${level}`} title={`Dificultad de cuidado: ${DIFFICULTY_LABELS[level]}`}>
      <span className="badge__dots" aria-hidden="true">
        {[1, 2, 3].map((n) => <i key={n} className={n <= dots ? 'on' : ''} />)}
      </span>
      {DIFFICULTY_LABELS[level]}
    </span>
  );
}

const PET_LABELS = {
  toxica: { icon: '⚠️', text: 'Tóxica para mascotas' },
  'no-toxica': { icon: '🐾', text: 'Segura para mascotas' },
  'sin-datos': { icon: '❔', text: 'Toxicidad sin datos' },
};

export function PetBadge({ status }) {
  const info = PET_LABELS[status] || PET_LABELS['sin-datos'];
  return <span className={`badge badge--pet badge--pet-${status}`}><span aria-hidden="true">{info.icon}</span> {info.text}</span>;
}

export function LightBadge({ level }) {
  if (!level) return null;
  const icon = { alta: '☀️', media: '⛅', baja: '🌥️' }[level];
  return <span className="badge badge--light"><span aria-hidden="true">{icon}</span> {LIGHT_LABELS[level]}</span>;
}

const COLOR_HEX = {
  rojo: '#D9534F', rosa: '#E8AAB8', blanco: '#FFFFFF', amarillo: '#F3D98B', naranja: '#F0A35E',
  morado: '#9B7BB8', azul: '#7FA7D9', verde: '#A8B5A0',
};

export function ColorDots({ colors = [], max = 6 }) {
  return (
    <span className="color-dots" aria-label={`Colores: ${colors.join(', ')}`}>
      {colors.slice(0, max).map((c) => <i key={c} style={{ background: COLOR_HEX[c] }} title={c} />)}
    </span>
  );
}
