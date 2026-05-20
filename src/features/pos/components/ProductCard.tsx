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
      className="rounded-xl p-4 text-left transition-shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-28 object-cover rounded-lg mb-3"
        />
      )}
      <p className="font-medium text-sm truncate" style={{ color: 'var(--fg)' }}>{product.name}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--fg-muted)' }}>Stock: {product.stock}</p>
      <p className="font-bold mt-1" style={{ color: 'var(--primary)' }}>
        ${product.price.toFixed(2)}
      </p>
    </button>
  );
}
