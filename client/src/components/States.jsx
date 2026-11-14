import Mascot from './Mascot.jsx';

export function EmptyState({ title, text, expression = 'thinking', children }) {
  return (
    <div className="state state--empty fade-up">
      <Mascot expression={expression} pose="idle" size={110} />
      <h2 className="state__title">{title}</h2>
      {text && <p className="state__text">{text}</p>}
      {children && <div className="state__actions">{children}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state state--error fade-up" role="alert">
      <Mascot expression="surprised" pose="idle" size={110} />
      <h2 className="state__title">Algo se marchitó por el camino</h2>
      <p className="state__text">{error?.message || 'No pudimos cargar la información.'}</p>
      {onRetry && <button type="button" className="btn btn--primary" onClick={onRetry}>Reintentar</button>}
    </div>
  );
}
