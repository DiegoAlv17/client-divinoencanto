import { NavLink } from 'react-router-dom';

const links = [
  { to: '/pos', label: 'POS', icon: '◈' },
  { to: '/sales', label: 'Ventas', icon: '◉' },
  { to: '/clients', label: 'Clientes', icon: '◎' },
  { to: '/products', label: 'Productos', icon: '◆' },
  { to: '/categories', label: 'Categorías', icon: '◇' },
  { to: '/reports', label: 'Reportes', icon: '▣' },
];

export default function Sidebar() {
  return (
    <aside
      className="flex w-64 shrink-0 flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        borderRadius: 'var(--radius-shell)',
      }}
    >
      <div className="border-b px-6 py-7" style={{ borderColor: 'var(--border)' }}>
        <h2
          className="text-xl font-bold tracking-tight leading-tight"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}
        >
          Divino Encanto
        </h2>
        <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>Sistema de gestión</p>
      </div>
      <nav className="flex-1 space-y-1.5 px-3.5 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive ? 'font-semibold' : 'hover:translate-x-0.5'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? '#fff' : 'var(--fg-muted)',
              boxShadow: isActive ? 'var(--shadow-md)' : 'none',
              borderRadius: 'var(--radius-control)',
            })}
          >
            <span className="text-base" style={{ opacity: 0.8 }}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs text-center" style={{ color: 'var(--fg-muted)', opacity: 0.6 }}>v1.0</p>
      </div>
    </aside>
  );
}
