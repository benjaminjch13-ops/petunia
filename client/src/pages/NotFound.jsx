import { Link } from 'react-router-dom';
import { EmptyState } from '../components/States.jsx';

export default function NotFound() {
  return (
    <div className="container page">
      <EmptyState title="Esta página no ha florecido" text="Parece que el enlace no existe o se ha movido." expression="surprised">
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
        <Link to="/catalogo" className="btn btn--ghost">Ir al catálogo</Link>
      </EmptyState>
    </div>
  );
}
