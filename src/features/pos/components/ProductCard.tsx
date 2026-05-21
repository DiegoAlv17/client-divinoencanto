import type { ProductResponse } from '../../../types';
import { useCartStore } from '../../../store/cart.store';

interface Props {
  product: ProductResponse;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const disabled = product.stock <= 0 || !product.active;

  return (
    <button
      onClick={() => addItem(product)}
      disabled={disabled}
      className="rounded-xl p-4 text-left transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-28 object-cover rounded-lg mb-3"
          style={{ border: '1px solid var(--border)' }}
        />
      ) : (
        <div
          className="w-full h-28 rounded-lg mb-3 flex items-center justify-center text-2xl"
          style={{ backgroundColor: 'var(--bg-surface-alt)', border: '1px solid var(--border)', color: 'var(--accent)' }}
        >
          ◆
        </div>
      )}
      <p className="font-medium text-sm truncate" style={{ color: 'var(--fg)' }}>{product.name}</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs" style={{ color: 'var(--fg-muted)' }}>Stock: {product.stock}</p>
        <p className="font-bold text-sm" style={{ color: 'var(--primary)' }}>
          ${product.price.toFixed(2)}
        </p>
      </div>
    </button>
  );
}
