import { useState } from 'react';
import { useCartStore } from '../../../store/cart.store';
import { useToastStore } from '../../../store/toast.store';
import { posApi } from '../../../api/pos.api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

interface Props {
  clientId: number;
  onClose: () => void;
}

export default function CheckoutModal({ clientId, onClose }: Props) {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const clear = useCartStore((s) => s.clear);
  const push = useToastStore((s) => s.push);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await posApi.checkout({
        clientId,
        notes: notes || undefined,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      });
      clear();
      push('Venta registrada exitosamente', 'success');
      onClose();
    } catch {
      push('Error al procesar la venta', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Confirmar Venta">
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between text-sm" style={{ color: 'var(--fg)' }}>
            <span>{item.product.name} × {item.quantity}</span>
            <span>${(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold pt-2 border-t" style={{ borderColor: 'var(--border)', color: 'var(--fg)' }}>
          <span>Total</span>
          <span>${total().toFixed(2)}</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>Notas (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
          style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
        />
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button onClick={handleConfirm} loading={loading} className="flex-1">
          Confirmar
        </Button>
      </div>
    </Modal>
  );
}
