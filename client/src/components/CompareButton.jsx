import { useCompare, MAX_COMPARE } from '../context/CompareContext.jsx';
import { useMascot } from '../context/MascotContext.jsx';

export default function CompareButton({ flower, size = 'sm' }) {
  const { isComparing, toggleCompare } = useCompare();
  const { say } = useMascot();
  const active = isComparing(flower.id);

  const onClick = () => {
    const result = toggleCompare(flower);
    if (result === 'full') {
      say(`Solo puedo comparar ${MAX_COMPARE} flores a la vez. Quita alguna desde la barra inferior.`, { expression: 'thinking', force: true });
    }
  };

  return (
    <button
      type="button"
      className={`btn btn--ghost btn--${size} compare-btn ${active ? 'is-active' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {active ? '✓ Comparando' : '⚖️ Comparar'}
    </button>
  );
}
