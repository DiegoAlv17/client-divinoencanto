interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export default function Table<T extends { id?: number }>({ columns, data, onRowClick, emptyMessage = 'Sin datos' }: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div
        className="py-16 text-center"
        style={{
          color: 'var(--fg-muted)',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-surface)',
          paddingInline: '0.75rem',
        }}
      >
        <p className="text-lg opacity-60">∅</p>
        <p className="mt-2 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        borderRadius: 'var(--radius-surface)',
        padding: '0.5rem',
      }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: 'var(--bg-surface-alt)' }}>
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-5 py-4 font-semibold text-xs uppercase tracking-wider"
                style={{ color: 'var(--fg-muted)', borderBottom: '1px solid var(--border)' }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.id ?? idx}
              onClick={() => onRowClick?.(row)}
              className={`transition-colors duration-150 ${onRowClick ? 'cursor-pointer' : ''}`}
              style={{ borderBottom: idx < data.length - 1 ? '1px solid var(--border)' : 'none' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-alt)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4 align-middle" style={{ color: 'var(--fg)' }}>
                  {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
