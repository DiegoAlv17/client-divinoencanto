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
      className="flex h-full min-h-0 w-full shrink-0 flex-col overflow-hidden rounded-xl p-5 lg:w-80"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
    >
      <h2 className="text-lg font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>
        Carrito
      </h2>

      <ClientSelector value={clientId} onChange={setClientId} />

      <div className="my-4 flex-1 space-y-3 overflow-y-auto pr-1">
        {items.length === 0 && (
          <div className="text-center py-10">
            <p className="text-2xl mb-2 opacity-40">🛒</p>
            <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Carrito vacío</p>
          </div>
        )}
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center gap-3 p-3 rounded-lg transition-colors duration-150"
            style={{ backgroundColor: 'var(--bg-surface-alt)', border: '1px solid var(--border)' }}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--fg)' }}>
                {item.product.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--fg-muted)' }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => updateQty(item.product.id, item.quantity - 1)}
                className="w-7 h-7 rounded-md text-sm font-bold flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              >
                −
              </button>
              <span className="w-7 text-center text-sm font-semibold" style={{ color: 'var(--fg)' }}>{item.quantity}</span>
              <button
                onClick={() => updateQty(item.product.id, item.quantity + 1)}
                className="w-7 h-7 rounded-md text-sm font-bold flex items-center justify-center transition-colors"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.product.id)}
              className="text-sm w-7 h-7 rounded-md flex items-center justify-center transition-colors"
              style={{ color: 'var(--danger)' }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex justify-between mb-4">
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
