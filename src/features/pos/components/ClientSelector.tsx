import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { clientsApi } from '../../../api/clients.api';
import type { ClientResponse } from '../../../types';

interface Props {
  value: number | null;
  onChange: (id: number | null) => void;
}

export default function ClientSelector({ value, onChange }: Props) {
  const { data: clients = [] } = useSWR('clients', clientsApi.findAll);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = clients.filter((c) =>
    `${c.name} ${c.lastname}`.toLowerCase().includes(search.toLowerCase())
  );

  const showList = search.length > 0 && filtered.length > 0 && !value;

  const selectClient = (client: ClientResponse) => {
    onChange(client.id);
    setSearch(`${client.name} ${client.lastname}`);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showList) return;

    if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        selectClient(filtered[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const item = listRef.current.children[activeIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [search]);

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
        onKeyDown={handleKeyDown}
        readOnly={!!value}
        className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-1"
        style={{
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          color: 'var(--fg)',
          cursor: value ? 'default' : undefined,
          opacity: value ? 0.7 : 1,
        }}
      />
      {showList ? (
        <div
          ref={listRef}
          className="max-h-32 overflow-y-auto rounded-lg"
          style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}
        >
          {filtered.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => selectClient(c)}
              className="w-full text-left px-3 py-2 text-sm transition-colors"
              style={{
                color: 'var(--fg)',
                backgroundColor: idx === activeIndex ? 'var(--bg-surface)' : 'transparent',
              }}
            >
              {c.name} {c.lastname}
            </button>
          ))}
        </div>
      ) : null}
      {value ? (
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
      ) : null}
    </div>
  );
}
