import { useEffect, useState } from 'react';
import { salesApi } from '../../api/sales.api';
import type { SaleResponse } from '../../types';
import Table from '../../components/ui/Table';
import Spinner from '../../components/ui/Spinner';
import SaleDetailModal from './SaleDetailModal';

export default function SalesPage() {
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SaleResponse | null>(null);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const load = () => {
    setLoading(true);
    const fetcher = from && to
      ? salesApi.findByDateRange(from, to)
      : salesApi.findAll();
    fetcher.then(setSales).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleFilter = () => {
    if (from && to) load();
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>Ventas</h1>

      <div className="flex gap-3 mb-6 items-end flex-wrap">
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--fg-muted)' }}>Desde</label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          />
        </div>
        <div>
          <label className="block text-xs mb-1" style={{ color: 'var(--fg-muted)' }}>Hasta</label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          />
        </div>
        <button
          onClick={handleFilter}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{ backgroundColor: 'var(--primary)', color: '#fff' }}
        >
          Filtrar
        </button>
        {(from || to) && (
          <button
            onClick={() => { setFrom(''); setTo(''); setTimeout(load, 0); }}
            className="px-3 py-2 text-sm underline"
            style={{ color: 'var(--accent)' }}
          >
            Limpiar
          </button>
        )}
      </div>

      <Table
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'saleDate', header: 'Fecha' },
          { key: 'clientId', header: 'Cliente ID' },
          { key: 'totalAmount', header: 'Total', render: (r) => `$${r.totalAmount.toFixed(2)}` },
        ]}
        data={sales}
        onRowClick={setSelected}
      />

      {selected && (
        <SaleDetailModal sale={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
