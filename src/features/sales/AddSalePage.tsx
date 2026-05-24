import { useState } from 'react';
import useSWR from 'swr';
import { clientsApi } from '../../api/clients.api';
import { productsApi } from '../../api/products.api';
import { posApi } from '../../api/pos.api';
import type { ClientResponse, ProductResponse } from '../../types';
import Button from '../../components/ui/Button';
import { useToastStore } from '../../store/toast.store';

interface LineItem {
  product: ProductResponse;
  quantity: number;
}

export default function AddSalePage() {
  const { data: clients = [] } = useSWR('clients', clientsApi.findAll);
  const { data: products = [] } = useSWR('products', productsApi.findAll);
  const push = useToastStore((s) => s.push);

  const [clientId, setClientId] = useState<number | ''>('');
  const [clientSearch, setClientSearch] = useState('');
  const [saleDate, setSaleDate] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<LineItem[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [isDebt, setIsDebt] = useState(true);
  const [hasPartial, setHasPartial] = useState(false);
  const [amountPaid, setAmountPaid] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredClients = clients.filter((c) =>
    `${c.name} ${c.lastname}`.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) && p.active
  );

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const parsedPaid = parseFloat(amountPaid);
  const pendingAmount = isDebt
    ? hasPartial && !isNaN(parsedPaid) ? total - parsedPaid : total
    : 0;

  const selectClient = (c: ClientResponse) => {
    setClientId(c.id);
    setClientSearch(`${c.name} ${c.lastname}`);
  };

  const clearClient = () => {
    setClientId('');
    setClientSearch('');
  };

  const addProduct = (p: ProductResponse) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === p.id);
      if (existing) {
        return prev.map((i) => i.product.id === p.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product: p, quantity: 1 }];
    });
    setProductSearch('');
  };

  const updateQty = (id: number, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((i) => i.product.id !== id));
    } else {
      setItems((prev) => prev.map((i) => i.product.id === id ? { ...i, quantity: qty } : i));
    }
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== id));
  };

  const handleSubmit = async () => {
    if (!clientId) { push('Selecciona un cliente', 'error'); return; }
    if (!saleDate) { push('Selecciona la fecha de venta', 'error'); return; }
    if (items.length === 0) { push('Agrega al menos un producto', 'error'); return; }
    if (isDebt && hasPartial && (isNaN(parsedPaid) || parsedPaid < 0 || parsedPaid >= total)) {
      push('El abono debe ser mayor o igual a 0 y menor al total', 'error');
      return;
    }

    setLoading(true);
    try {
      await posApi.checkout({
        clientId: clientId as number,
        notes: notes || undefined,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        saleDate,
        amountPaid: isDebt ? (hasPartial ? parsedPaid : 0) : undefined,
        dueDate: isDebt && dueDate ? dueDate : undefined,
      });
      push('Venta registrada exitosamente', 'success');
      setItems([]);
      setNotes('');
      setSaleDate('');
      setAmountPaid('');
      setDueDate('');
      setIsDebt(true);
      setHasPartial(false);
      clearClient();
    } catch {
      push('Error al registrar la venta', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>
        Registrar Venta Anterior
      </h1>
      <p className="text-sm mb-8" style={{ color: 'var(--fg-muted)' }}>
        Registra ventas de días anteriores para mantener el historial de deudas actualizado.
      </p>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div className="space-y-5">
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--fg-muted)' }}>
              Fecha de venta *
            </label>
            <input
              type="date"
              value={saleDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSaleDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
            />
          </div>

          {/* Client */}
          <div className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--fg-muted)' }}>
              Cliente *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={clientSearch}
                onChange={(e) => { setClientSearch(e.target.value); if (clientId) clearClient(); }}
                readOnly={!!clientId}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
                style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)', opacity: clientId ? 0.7 : 1 }}
              />
              {clientId && (
                <button onClick={clearClient} className="px-3 text-sm font-medium" style={{ color: 'var(--danger)' }}>✕</button>
              )}
            </div>
            {clientSearch && !clientId && filteredClients.length > 0 && (
              <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-lg shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                {filteredClients.slice(0, 8).map((c) => (
                  <button key={c.id} onClick={() => selectClient(c)} className="w-full text-left px-4 py-2 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--fg)' }}>
                    {c.name} {c.lastname}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product search */}
          <div className="relative">
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--fg-muted)' }}>
              Agregar productos
            </label>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
              style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
            />
            {productSearch && filteredProducts.length > 0 && (
              <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-lg shadow-lg" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
                {filteredProducts.slice(0, 8).map((p) => (
                  <button key={p.id} onClick={() => addProduct(p)} className="w-full text-left px-4 py-2 text-sm hover:opacity-80 transition-opacity flex justify-between" style={{ color: 'var(--fg)' }}>
                    <span>{p.name}</span>
                    <span style={{ color: 'var(--fg-muted)' }}>${p.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--fg-muted)' }}>
              Notas (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none"
              style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
            />
          </div>

          {/* Debt toggle */}
          <div
            className="p-3 rounded-lg"
            style={{ backgroundColor: isDebt ? 'color-mix(in srgb, var(--danger) 8%, var(--bg))' : 'var(--bg)', border: `1px solid ${isDebt ? 'var(--danger)' : 'var(--border)'}`, transition: 'all 0.15s' }}
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isDebt} onChange={(e) => { setIsDebt(e.target.checked); if (!e.target.checked) { setHasPartial(false); setAmountPaid(''); setDueDate(''); } }} className="w-4 h-4 rounded" style={{ accentColor: 'var(--danger)' }} />
              <span className="text-sm font-semibold" style={{ color: isDebt ? 'var(--danger)' : 'var(--fg)' }}>Registrar como deuda</span>
              {isDebt && total > 0 && <span className="ml-auto text-sm font-bold" style={{ color: 'var(--danger)' }}>Debe: ${pendingAmount.toFixed(2)}</span>}
            </label>
            {isDebt && (
              <div className="mt-3 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={hasPartial} onChange={(e) => { setHasPartial(e.target.checked); setAmountPaid(''); }} className="w-3.5 h-3.5 rounded" style={{ accentColor: 'var(--accent)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--fg-muted)' }}>El cliente abonó algo</span>
                </label>
                {hasPartial && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--fg-muted)' }}>Monto abonado</label>
                    <input type="number" step="0.01" min="0.01" max={total - 0.01} value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} placeholder={`Máx: $${(total - 0.01).toFixed(2)}`} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--fg)' }} />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--fg-muted)' }}>Fecha límite de pago (opcional)</label>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--fg)' }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Items summary */}
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--fg)' }}>Productos en la venta</h3>
          {items.length === 0 ? (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--fg-muted)' }}>Agrega productos desde la búsqueda</p>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--fg)' }}>{item.product.name}</p>
                    <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>${item.product.price.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}>−</button>
                    <span className="text-sm font-medium w-6 text-center" style={{ color: 'var(--fg)' }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-md flex items-center justify-center text-sm font-bold" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}>+</button>
                  </div>
                  <span className="text-sm font-semibold w-16 text-right" style={{ color: 'var(--fg)' }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.product.id)} className="text-xs" style={{ color: 'var(--danger)' }}>✕</button>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-bold text-sm" style={{ color: 'var(--fg)' }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button onClick={handleSubmit} loading={loading} className="w-full" disabled={items.length === 0 || !clientId || !saleDate}>
              Registrar Venta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
