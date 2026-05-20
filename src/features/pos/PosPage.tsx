import { useEffect, useState } from 'react';
import { posApi } from '../../api/pos.api';
import type { ProductResponse } from '../../types';
import ProductCard from './components/ProductCard';
import CartPanel from './components/CartPanel';
import Spinner from '../../components/ui/Spinner';

export default function PosPage() {
  const [catalog, setCatalog] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    posApi.getCatalog().then(setCatalog).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-full">
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>
          Punto de Venta
        </h1>
        {catalog.length === 0 ? (
          <p style={{ color: 'var(--fg-muted)' }}>No hay productos disponibles</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {catalog.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <CartPanel />
    </div>
  );
}
