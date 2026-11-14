/** Ilustraciones botánicas decorativas (SVG originales, sin significado semántico). */
function Leaf({ x, y, rotate = 0, scale = 1, fill = '#A8B5A0' }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0 C 18 -22, 50 -22, 70 0 C 50 22, 18 22, 0 0 Z" fill={fill} opacity="0.85" />
      <path d="M4 0 C 24 -2, 46 -2, 66 0" stroke="#526B55" strokeWidth="1.4" fill="none" opacity="0.6" />
    </g>
  );
}

function Blossom({ x, y, r = 10, fill = '#F4C6CF' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} rx={r * 0.55} ry={r} transform={`rotate(${a}) translate(0 ${-r})`} fill={fill} stroke="#E8AAB8" strokeWidth="1.2" />
      ))}
      <circle r={r * 0.45} fill="#F3D98B" />
    </g>
  );
}

export default function BotanicalDecor({ variant = 'hero' }) {
  if (variant === 'footer') {
    return (
      <svg className="decor decor--footer" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 C 200 10, 400 60, 600 30 C 800 0, 1000 50, 1200 25 L1200 60 L0 60 Z" fill="#A8B5A0" opacity="0.35" />
        <path d="M0 50 C 250 30, 450 65, 700 40 C 900 20, 1050 55, 1200 40 L1200 60 L0 60 Z" fill="#526B55" opacity="0.18" />
      </svg>
    );
  }

  if (variant === 'divider') {
    return (
      <svg className="decor decor--divider" viewBox="0 0 240 40" aria-hidden="true">
        <path d="M10 20 H230" stroke="#A8B5A0" strokeWidth="1.5" />
        <Leaf x={70} y={20} rotate={-20} scale={0.5} />
        <Leaf x={170} y={20} rotate={200} scale={0.5} />
        <Blossom x={120} y={20} r={9} />
      </svg>
    );
  }

  return (
    <svg className="decor decor--hero" viewBox="0 0 400 400" aria-hidden="true">
      <path d="M40 380 C 80 300, 60 220, 120 140 C 160 90, 220 70, 260 40" stroke="#526B55" strokeWidth="3" fill="none" opacity="0.5" />
      <Leaf x={70} y={300} rotate={-60} />
      <Leaf x={95} y={220} rotate={-110} scale={0.9} fill="#C4CEBE" />
      <Leaf x={130} y={150} rotate={-40} scale={0.8} />
      <Leaf x={190} y={95} rotate={-120} scale={0.7} fill="#C4CEBE" />
      <Blossom x={262} y={40} r={16} />
      <Blossom x={150} y={130} r={10} fill="#FFF8EF" />
      <Blossom x={60} y={250} r={12} />
    </svg>
  );
}
