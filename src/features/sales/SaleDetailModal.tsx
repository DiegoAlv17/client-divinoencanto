import type { SaleResponse } from '../../types';
import Modal from '../../components/ui/Modal';

interface Props {
  sale: SaleResponse;
  onClose: () => void;
}

export default function SaleDetailModal({ sale, onClose }: Props) {
  const createdAtFormatted = sale.createdAt
    ? new Date(sale.createdAt).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })
    : null;

  return (
    <Modal open onClose={onClose} title={`Venta #${sale.id}`}>
      <div className="space-y-2 mb-4">
        <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>
          Fecha: {sale.saleDate}
          {createdAtFormatted && ` — ${createdAtFormatted}`}
        </p>
        <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Cliente: {sale.clientName}</p>
        {sale.notes && <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Notas: {sale.notes}</p>}
      </div>

      <div className="space-y-2">
        {sale.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-2 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          >
            <span>{item.productName} × {item.quantity}</span>
            <span>${item.subTotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
        <div className="flex justify-between font-bold" style={{ color: 'var(--fg)' }}>
          <span>Total</span>
          <span>${sale.totalAmount.toFixed(2)}</span>
        </div>
        {sale.difference > 0 && (
          <div className="flex justify-between text-sm font-semibold" style={{ color: '#DC2626' }}>
            <span>Deuda pendiente</span>
            <span>${sale.difference.toFixed(2)}</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
