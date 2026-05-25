import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="text-center max-w-md p-10 rounded-2xl"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}
      >
        <p className="text-6xl font-bold mb-2" style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
          404
        </p>
        <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
          Página no encontrada
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--fg-muted)' }}>
          La página que buscas no existe o fue movida.
        </p>
        <Link to="/pos">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
