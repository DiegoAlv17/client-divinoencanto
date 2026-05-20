import type { SaleResponse } from '../../types';
import Modal from '../../components/ui/Modal';

interface Props {
  sale: SaleResponse;
  onClose: () => void;
}

export default function SaleDetailModal({ sale, onClose }: Props) {
  return (
    <Modal open onClose={onClose} title={`Venta #${sale.id}`}>
      <div className="space-y-2 mb-4">
        <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Fecha: {sale.saleDate}</p>
        <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Cliente ID: {sale.clientId}</p>
        {sale.notes && <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Notas: {sale.notes}</p>}
      </div>

      <div className="space-y-2">
        {sale.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between p-2 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          >
            <span>Producto #{item.productId} × {item.quantity}</span>
            <span>${item.subTotal.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4 pt-3 border-t font-bold" style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}>
        <span>Total</span>
        <span>${sale.totalAmount.toFixed(2)}</span>
      </div>
    </Modal>
  );
}
