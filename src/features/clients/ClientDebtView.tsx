import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { salesApi } from '../../api/sales.api';
import { generateDebtReportHtml, openPrintableReport } from '../../utils/debt-report';
import { useClientDebt, filterSales } from './hooks/useClientDebt';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { useToastStore } from '../../store/toast.store';

type Filter = 'all' | 'debt' | 'paid';

export default function ClientDebtView() {
  const { id } = useParams<{ id: string }>();
  const clientId = id ? Number(id) : null;
  const push = useToastStore((s) => s.push);
  const [filter, setFilter] = useState<Filter>('all');

  const { client, sales, salesWithDebt, totalDebt, isLoading, error, mutate } = useClientDebt(clientId);

  const filteredSales = useMemo(
    () => filterSales(sales, salesWithDebt, filter),
    [sales, salesWithDebt, filter]
  );

  const handleCancelDebt = async (saleItemId: number) => {
    try {
      await salesApi.cancelDebt(saleItemId);
      push('Deuda cancelada', 'success');
      mutate();
    } catch {
      push('Error al cancelar la deuda', 'error');
    }
  };

  const handleGeneratePdf = () => {
    if (!client) return;
    const html = generateDebtReportHtml({ client, salesWithDebt, totalDebt });
    if (!openPrintableReport(html)) {
      push('Permite ventanas emergentes para generar el PDF', 'error');
    }
  };

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  if (error) {
    return (
      <div className="text-center py-16">
        <Link to="/clients" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: 'var(--accent)' }}>
          ← Volver a Clientes
        </Link>
        <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <p className="text-lg font-medium mb-2" style={{ color: 'var(--danger)' }}>Error al cargar datos</p>
          <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
            No se pudieron obtener los datos del cliente. Intenta nuevamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link to="/clients" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: 'var(--accent)' }}>
        ← Volver a Clientes
      </Link>

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>
          {client?.name} {client?.lastname}
        </h1>
        {salesWithDebt.length > 0 && (
          <Button onClick={handleGeneratePdf}>Generar Reporte PDF</Button>
        )}
      </div>

      {client && (
        <div
          className="mb-6 p-5 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          {client.email && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--fg-muted)' }}>Email</p>
              <p className="text-sm" style={{ color: 'var(--fg)' }}>{client.email}</p>
            </div>
          )}
          {client.phone && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--fg-muted)' }}>Teléfono</p>
              <p className="text-sm" style={{ color: 'var(--fg)' }}>{client.phone}</p>
            </div>
          )}
          {client.address && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--fg-muted)' }}>Dirección</p>
              <p className="text-sm" style={{ color: 'var(--fg)' }}>{client.address}</p>
            </div>
          )}
        </div>
      )}

      {/* Total debt summary */}
      <div
        className="mb-6 p-5 rounded-xl"
        style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--fg-muted)' }}>Total pendiente</p>
        <p className="text-3xl font-bold" style={{ color: totalDebt > 0 ? 'var(--danger)' : 'var(--fg)' }}>
          ${totalDebt.toFixed(2)}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {([['all', 'Todas'], ['debt', 'Con deuda'], ['paid', 'Pagadas']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: filter === key ? 'var(--primary)' : 'var(--bg)',
              color: filter === key ? '#fff' : 'var(--fg-muted)',
              border: `1px solid ${filter === key ? 'var(--primary)' : 'var(--border)'}`,
            }}
          >
            {label} {key === 'debt' && salesWithDebt.length > 0 && `(${salesWithDebt.length})`}
          </button>
        ))}
      </div>

      {/* Sales list */}
      {filteredSales.length === 0 ? (
        <p className="text-sm py-8 text-center" style={{ color: 'var(--fg-muted)' }}>
          {filter === 'debt' ? 'No hay deudas pendientes.' : filter === 'paid' ? 'No hay ventas pagadas.' : 'No hay ventas registradas.'}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredSales.map((sale) => {
            const hasDebt = sale.items.some((item) => item.difference > 0);
            return (
              <div
                key={sale.id}
                className="p-5 rounded-xl"
                style={{ backgroundColor: 'var(--bg-surface)', border: `1px solid ${hasDebt ? 'color-mix(in srgb, var(--danger) 30%, var(--border))' : 'var(--border)'}`, boxShadow: 'var(--shadow-sm)' }}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm" style={{ color: 'var(--fg)' }}>
                      Venta #{sale.id} — {sale.saleDate}
                    </span>
                    <Badge variant={hasDebt ? 'warning' : 'success'}>{hasDebt ? 'Pendiente' : 'Pagada'}</Badge>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--fg)' }}>${sale.totalAmount.toFixed(2)}</span>
                </div>
                {sale.notes && (
                  <p className="text-xs mb-2" style={{ color: 'var(--fg-muted)' }}>Nota: {sale.notes}</p>
                )}
                <div className="space-y-1.5">
                  {sale.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm" style={{ color: 'var(--fg-muted)' }}>
                      <span>{item.productName} × {item.quantity} — ${item.subTotal.toFixed(2)}</span>
                      <div className="flex items-center gap-3">
                        {item.difference > 0 ? (
                          <>
                            <span style={{ color: 'var(--danger)' }}>Debe: ${item.difference.toFixed(2)}</span>
                            <button
                              onClick={() => handleCancelDebt(item.id)}
                              className="px-2 py-1 rounded text-xs font-medium transition-opacity hover:opacity-80"
                              style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 15%, var(--bg))', color: 'var(--accent)' }}
                            >
                              Marcar pagado
                            </button>
                          </>
                        ) : (
                          <span style={{ color: 'var(--fg-muted)', opacity: 0.6 }}>Pagado</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
