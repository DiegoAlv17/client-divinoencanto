import { NavLink } from 'react-router-dom';
import { useSidebarStore } from '../../store/sidebar.store';

const links = [
  { to: '/pos', label: 'POS', icon: '◈' },
  { to: '/sales', label: 'Ventas', icon: '◉' },
  { to: '/clients', label: 'Clientes', icon: '◎' },
  { to: '/products', label: 'Productos', icon: '◆' },
  { to: '/categories', label: 'Categorías', icon: '◇' },
  { to: '/reports', label: 'Reportes', icon: '▣' },
];

export default function Sidebar() {
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggle = useSidebarStore((s) => s.toggle);

  return (
    <aside
      className="flex shrink-0 flex-col overflow-hidden transition-all duration-300"
      style={{
        width: collapsed ? '4.5rem' : '16rem',
        backgroundColor: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        borderRadius: 'var(--radius-shell)',
      }}
    >
      <div className="border-b px-4 py-5 flex items-center" style={{ borderColor: 'var(--border)', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && (
          <div>
            <h2
              className="text-xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}
            >
              Divino Encanto
            </h2>
            <p className="mt-1 text-xs leading-relaxed" style={{ color: 'var(--fg-muted)' }}>Sistema de gestión</p>
          </div>
        )}
        <button
          onClick={toggle}
          className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:opacity-80"
          style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg-muted)' }}
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <span className="text-sm">{collapsed ? '▶' : '◀'}</span>
        </button>
      </div>
      <nav className="flex-1 space-y-1.5 px-2 py-4">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3 text-sm font-medium transition-all duration-200 ${
                collapsed ? 'justify-center px-2' : 'px-4'
              } ${isActive ? 'font-semibold' : 'hover:translate-x-0.5'}`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--primary)' : 'transparent',
              color: isActive ? '#fff' : 'var(--fg-muted)',
              boxShadow: isActive ? 'var(--shadow-md)' : 'none',
              borderRadius: 'var(--radius-control)',
            })}
            title={collapsed ? link.label : undefined}
          >
            <span className="text-base" style={{ opacity: 0.8 }}>{link.icon}</span>
            {!collapsed && link.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t px-4 py-4" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs text-center" style={{ color: 'var(--fg-muted)', opacity: 0.6 }}>
          {collapsed ? 'v1' : 'v1.0'}
        </p>
      </div>
    </aside>
  );
}
