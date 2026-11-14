import { usePreferences } from '../context/PreferencesContext.jsx';

export default function HemisphereToggle({ compact = false }) {
  const { hemisphere, setHemisphere } = usePreferences();
  return (
    <div className={`segmented ${compact ? 'segmented--compact' : ''}`} role="radiogroup" aria-label="Hemisferio">
      {[
        { id: 'north', label: compact ? 'Norte' : '🌍 Hemisferio norte' },
        { id: 'south', label: compact ? 'Sur' : '🌏 Hemisferio sur' },
      ].map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={hemisphere === option.id}
          className={hemisphere === option.id ? 'is-active' : ''}
          onClick={() => setHemisphere(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
