import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { salesApi } from '../../api/sales.api';
import { clientsApi } from '../../api/clients.api';
import type { SaleResponse, ClientResponse } from '../../types';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

export default function ClientDebtView() {
  const { id } = useParams<{ id: string }>();
  const [sales, setSales] = useState<SaleResponse[]>([]);
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const clientId = parseInt(id);
    Promise.all([
      salesApi.findByClientId(clientId),
      clientsApi.findById(clientId),
    ]).then(([salesData, clientData]) => {
      setSales(salesData);
      setClient(clientData);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  const salesWithDebt = sales.filter((sale) =>
    sale.items.some((item) => item.difference > 0)
  );

  const totalDebt = salesWithDebt.reduce(
    (sum, sale) => sum + sale.items.reduce((s, item) => s + (item.difference > 0 ? item.difference : 0), 0),
    0
  );

  return (
    <div>
      <Link to="/clients" className="text-sm underline mb-4 inline-block" style={{ color: 'var(--accent)' }}>
        ← Volver a Clientes
      </Link>

      <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>
        Deudas — {client?.name} {client?.lastname}
      </h1>

      <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
        <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Total pendiente</p>
        <p className="text-2xl font-bold" style={{ color: 'var(--danger)' }}>${totalDebt.toFixed(2)}</p>
      </div>

      {salesWithDebt.length === 0 ? (
        <p style={{ color: 'var(--fg-muted)' }}>Este cliente no tiene deudas pendientes.</p>
      ) : (
        <div className="space-y-4">
          {salesWithDebt.map((sale) => (
            <div
              key={sale.id}
              className="p-4 rounded-xl"
              style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
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
