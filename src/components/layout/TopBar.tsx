import { useAuthStore } from '../../store/auth.store';
import { useThemeStore } from '../../store/theme.store';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const { theme, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <header
      className="h-14 flex items-center justify-end px-6 border-b shrink-0 gap-4"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <button
        onClick={toggle}
        className="p-2 rounded-lg text-sm"
        style={{ border: '1px solid var(--border)', color: 'var(--fg)' }}
        title="Cambiar tema"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {user && (
        <span className="text-sm font-medium" style={{ color: 'var(--fg-muted)' }}>
          {user.username}
        </span>
      )}

      <button
        onClick={handleLogout}
        className="px-3 py-1.5 rounded-lg text-sm font-medium"
        style={{ backgroundColor: 'var(--danger)', color: '#fff' }}
      >
        Salir
      </button>
    </header>
  );
}
