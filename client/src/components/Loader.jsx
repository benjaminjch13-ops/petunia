export default function Loader({ label = 'Cargando…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <svg viewBox="0 0 60 60" className="loader__flower" aria-hidden="true">
        <g transform="translate(30 30)">
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <ellipse key={a} rx="6" ry="12" transform={`rotate(${a}) translate(0 -12)`} fill={i % 2 ? '#F4C6CF' : '#E8AAB8'} />
          ))}
          <circle r="6" fill="#F3D98B" />
        </g>
      </svg>
      <span>{label}</span>
    </div>
  );
}
