import { memo } from 'react';
import { MASCOT_NAME } from '../data/mascotMessages.js';

/**
 * Tuni: mascota ilustrada de Petunia (SVG original).
 *
 * expression: happy | excited | wink | surprised | thinking | sleepy
 * pose:       idle | wave | jump | point | celebrate | still
 */
const INK = '#3F5242';
const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function OpenEye({ cx, cy, look = [0, 0] }) {
  return (
    <g className="mascot__eye">
      <ellipse cx={cx} cy={cy} rx="5.5" ry="6.5" fill={INK} />
      <circle cx={cx + 1.8 + look[0]} cy={cy - 2.2 + look[1]} r="2" fill="#fff" />
    </g>
  );
}

const HappyEye = ({ cx, cy }) => (
  <path d={`M${cx - 7} ${cy + 2} q7 -9 14 0`} stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
);

const LineEye = ({ cx, cy }) => (
  <path d={`M${cx - 7} ${cy + 1} q7 4 14 0`} stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
);

function Face({ expression }) {
  switch (expression) {
    case 'excited':
      return (
        <g>
          <OpenEye cx={86} cy={82} />
          <OpenEye cx={114} cy={82} />
          <path d="M86 97 q14 20 28 0 z" fill={INK} />
          <path d="M93 104 q7 6 14 0 q-7 -4 -14 0z" fill="#F4A6B5" />
        </g>
      );
    case 'wink':
      return (
        <g>
          <OpenEye cx={86} cy={82} />
          <HappyEye cx={114} cy={82} />
          <path d="M88 99 q12 11 24 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'surprised':
      return (
        <g>
          <path d="M79 70 q7 -5 14 0 M107 70 q7 -5 14 0" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <OpenEye cx={86} cy={82} />
          <OpenEye cx={114} cy={82} />
          <ellipse cx="100" cy="103" rx="5.5" ry="7" fill={INK} />
        </g>
      );
    case 'thinking':
      return (
        <g>
          <path d="M80 71 q6 -3 12 1" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
          <OpenEye cx={86} cy={83} look={[1.5, -1.5]} />
          <OpenEye cx={114} cy={83} look={[1.5, -1.5]} />
          <path d="M92 103 q9 -4 17 1" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </g>
      );
    case 'sleepy':
      return (
        <g>
          <LineEye cx={86} cy={83} />
          <LineEye cx={114} cy={83} />
          <path d="M94 101 q6 5 12 0" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <text x="140" y="44" className="mascot__zzz" fill={INK} fontSize="16" fontFamily="Nunito, sans-serif" fontWeight="800">z</text>
        </g>
      );
    case 'happy':
    default:
      return (
        <g>
          <HappyEye cx={86} cy={83} />
          <HappyEye cx={114} cy={83} />
          <path d="M88 98 q12 12 24 0" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      );
  }
}

function Mascot({ expression = 'happy', pose = 'idle', size = 120, title, className = '', headOnly = false }) {
  const label = title || `${MASCOT_NAME}, la mascota de Petunia`;
  return (
    <svg
      viewBox={headOnly ? '20 5 160 160' : '0 0 200 240'}
      width={size}
      height={headOnly ? size : size * 1.2}
      className={`mascot mascot--${pose} ${className}`}
      role="img"
      aria-label={label}
    >
      {!headOnly && (
        <g className="mascot__body">
          <path d="M100 128 C 96 160, 106 180, 100 202" stroke="#526B55" strokeWidth="7" fill="none" strokeLinecap="round" />
          <g className="mascot__arm mascot__arm--left">
            <path d="M98 166 C 80 150, 58 152, 46 162 C 60 175, 84 177, 98 166 Z" fill="#A8B5A0" stroke="#526B55" strokeWidth="2.5" />
            <path d="M95 166 C 80 163, 66 162, 52 163" stroke="#526B55" strokeWidth="1.5" fill="none" />
          </g>
          <g className="mascot__arm mascot__arm--right">
            <path d="M102 158 C 120 142, 142 144, 154 154 C 140 167, 116 169, 102 158 Z" fill="#A8B5A0" stroke="#526B55" strokeWidth="2.5" />
            <path d="M105 158 C 120 155, 134 154, 148 155" stroke="#526B55" strokeWidth="1.5" fill="none" />
          </g>
          <path d="M68 204 h64 l-9 32 h-46 z" fill="#E8AAB8" stroke="#C98A99" strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="62" y="196" width="76" height="13" rx="6" fill="#F4C6CF" stroke="#C98A99" strokeWidth="2.5" />
          <path d="M86 222 q14 6 28 0" stroke="#FFF8EF" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>
      )}
      <g className="mascot__head">
        <g transform="translate(100 85)">
          {PETAL_ANGLES.map((angle, i) => (
            <ellipse
              key={angle}
              rx="20"
              ry="31"
              transform={`rotate(${angle}) translate(0 -43)`}
              fill={i % 2 ? '#F4C6CF' : '#E8AAB8'}
              stroke="#D48EA0"
              strokeWidth="2"
            />
          ))}
        </g>
        <circle cx="100" cy="85" r="40" fill="#FBE5A6" stroke="#E5C46C" strokeWidth="2.5" />
        <ellipse cx="75" cy="96" rx="7" ry="4.5" fill="#F4A6B5" opacity="0.75" />
        <ellipse cx="125" cy="96" rx="7" ry="4.5" fill="#F4A6B5" opacity="0.75" />
        <Face expression={expression} />
      </g>
    </svg>
  );
}

export default memo(Mascot);
