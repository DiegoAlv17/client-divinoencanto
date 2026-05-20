import { useEffect, useState } from 'react';
import { clientsApi } from '../../../api/clients.api';
import type { ClientResponse } from '../../../types';

interface Props {
  value: number | null;
  onChange: (id: number | null) => void;
}

export default function ClientSelector({ value, onChange }: Props) {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    clientsApi.findAll().then(setClients);
  }, []);

  const filtered = clients.filter((c) =>
    `${c.name} ${c.lastname}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
        Cliente
      </label>
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-1"
        style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
      />
      {search && filtered.length > 0 && !value && (
        <div
          className="max-h-32 overflow-y-auto rounded-lg"
          style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}
        >
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onChange(c.id);
                setSearch(`${c.name} ${c.lastname}`);
              }}
              className="w-full text-left px-3 py-2 text-sm hover:opacity-80"
              style={{ color: 'var(--fg)' }}
            >
              {c.name} {c.lastname}
            </button>
          ))}
        </div>
      )}
      {value && (
        <button
          onClick={() => {
            onChange(null);
            setSearch('');
          }}
          className="text-xs underline mt-1"
          style={{ color: 'var(--accent)' }}
        >
          Cambiar cliente
        </button>
      )}
    </div>
  );
}
