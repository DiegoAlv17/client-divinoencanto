import { useState } from 'react';
import { useCartStore } from '../../../store/cart.store';
import Button from '../../../components/ui/Button';
import ClientSelector from './ClientSelector';
import CheckoutModal from './CheckoutModal';

export default function CartPanel() {
  const items = useCartStore((s) => s.items);
  const total = useCartStore((s) => s.total);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const [clientId, setClientId] = useState<number | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <aside
      className="w-80 shrink-0 flex flex-col rounded-xl p-4 overflow-y-auto"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>
        Carrito
      </h2>

      <ClientSelector value={clientId} onChange={setClientId} />

      <div className="flex-1 overflow-y-auto space-y-3 my-4">
        {items.length === 0 && (
          <p className="text-sm text-center py-8" style={{ color: 'var(--fg-muted)' }}>
            Carrito vacío
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-2 p-2 rounded-lg"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--fg)' }}>
                {item.product.name}
              </p>
              <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQty(item.product.id, item.quantity - 1)}
                className="w-6 h-6 rounded text-sm font-bold"
                style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              >
                −
              </button>
              <span className="w-6 text-center text-sm" style={{ color: 'var(--fg)' }}>{item.quantity}</span>
              <button
                onClick={() => updateQty(item.product.id, item.quantity + 1)}
                className="w-6 h-6 rounded text-sm font-bold"
                style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.product.id)}
              className="text-sm"
              style={{ color: 'var(--danger)' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex justify-between mb-3">
          <span className="font-medium" style={{ color: 'var(--fg)' }}>Total</span>
          <span className="font-bold text-lg" style={{ color: 'var(--primary)' }}>
            ${total().toFixed(2)}
          </span>
        </div>
        <Button
          onClick={() => setShowCheckout(true)}
          disabled={items.length === 0 || !clientId}
          className="w-full"
        >
          Procesar Venta
        </Button>
      </div>

      {showCheckout && clientId && (
        <CheckoutModal clientId={clientId} onClose={() => setShowCheckout(false)} />
      )}
    </aside>
  );
}
