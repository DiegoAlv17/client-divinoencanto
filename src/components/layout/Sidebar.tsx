import { NavLink } from 'react-router-dom';

const links = [
  { to: '/pos', label: 'POS' },
  { to: '/sales', label: 'Ventas' },
  { to: '/clients', label: 'Clientes' },
  { to: '/products', label: 'Productos' },
  { to: '/categories', label: 'Categorías' },
  { to: '/reports', label: 'Reportes' },
];

export default function Sidebar() {
  return (
    <aside
      className="w-60 flex flex-col shrink-0 border-r"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <div className="px-6 py-5">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
          Divino Encanto
        </h2>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'font-semibold' : ''
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--accent)' : 'transparent',
              color: isActive ? '#fff' : 'var(--fg)',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
