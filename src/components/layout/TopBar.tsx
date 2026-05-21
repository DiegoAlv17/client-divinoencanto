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
      className="flex h-16 shrink-0 items-center justify-end gap-3 border px-5"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
        boxShadow: 'var(--shadow-sm)',
        borderRadius: 'var(--radius-shell)',
      }}
    >
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-lg text-sm flex items-center justify-center transition-colors duration-200"
        style={{ border: '1px solid var(--border)', color: 'var(--fg-muted)', backgroundColor: 'var(--bg)' }}
        title="Cambiar tema"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {user && (
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--accent)', color: '#fff' }}>
            {user.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--fg)' }}>
            {user.username}
          </span>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity duration-200 hover:opacity-80"
        style={{ backgroundColor: 'var(--danger)', color: '#fff' }}
      >
        Salir
      </button>
    </header>
  );
}
