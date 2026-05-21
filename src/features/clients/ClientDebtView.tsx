import { useMemo } from 'react';
import useSWR from 'swr';
import { useParams, Link } from 'react-router-dom';
import { salesApi } from '../../api/sales.api';
import { clientsApi } from '../../api/clients.api';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

export default function ClientDebtView() {
  const { id } = useParams<{ id: string }>();
  const clientId = id ? Number(id) : null;

  const { data: client, isLoading: clientLoading } = useSWR(
    clientId ? ['clients', clientId] : null,
    ([, cid]) => clientsApi.findById(cid)
  );
  const { data: sales = [], isLoading: salesLoading } = useSWR(
    clientId ? ['sales/client', clientId] : null,
    ([, cid]) => salesApi.findByClientId(cid)
  );

  const loading = clientLoading || salesLoading;

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  const salesWithDebt = sales.filter((sale) =>
    sale.items.some((item) => item.difference > 0)
  );

  const totalDebt = useMemo(
    () => salesWithDebt.reduce(
      (sum, sale) => sum + sale.items.reduce((s, item) => s + (item.difference > 0 ? item.difference : 0), 0),
      0
    ),
    [salesWithDebt]
  );

  return (
    <div>
      <Link to="/clients" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: 'var(--accent)' }}>
        ← Volver a Clientes
      </Link>

      <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>
        Deudas — {client?.name} {client?.lastname}
      </h1>

      <div
        className="mb-8 p-5 rounded-xl"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--fg-muted)' }}>Total pendiente</p>
        <p className="text-3xl font-bold" style={{ color: 'var(--danger)' }}>${totalDebt.toFixed(2)}</p>
      </div>

      {salesWithDebt.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Este cliente no tiene deudas pendientes.</p>
      ) : (
        <div className="space-y-4">
          {salesWithDebt.map((sale) => (
            <div
              key={sale.id}
              className="p-5 rounded-xl"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium text-sm" style={{ color: 'var(--fg)' }}>
                  Venta #{sale.id} — {sale.saleDate}
                </span>
                <Badge variant="warning">Pendiente</Badge>
              </div>
              <div className="space-y-1">
                {sale.items
                  .filter((item) => item.difference > 0)
                  .map((item) => (
                    <div key={item.id} className="flex justify-between text-sm" style={{ color: 'var(--fg-muted)' }}>
                      <span>Producto #{item.productId} × {item.quantity}</span>
                      <span style={{ color: 'var(--danger)' }}>Debe: ${item.difference.toFixed(2)}</span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
