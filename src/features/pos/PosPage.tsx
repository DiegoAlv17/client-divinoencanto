import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { posApi } from '../../api/pos.api';
import { categoriesApi } from '../../api/categories.api';
import ProductCard from './components/ProductCard';
import CartPanel from './components/CartPanel';
import Spinner from '../../components/ui/Spinner';

export default function PosPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const { data: catalog = [], isLoading: catalogLoading } = useSWR('pos/catalog', posApi.getCatalog);
  const { data: categories = [], isLoading: catsLoading } = useSWR('categories', categoriesApi.findAll);

  const loading = catalogLoading || catsLoading;

  const filtered = useMemo(
    () => selectedCategory ? catalog.filter((p) => p.categoryId === selectedCategory) : catalog,
    [catalog, selectedCategory]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div
      className="grid min-h-0 gap-5"
      style={{
        height: 'calc(100vh - var(--pos-viewport-offset))',
        gridTemplateRows: 'auto minmax(0, 1fr)',
      }}
    >
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>
        Punto de Venta
      </h1>

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,20rem)]">
        <div className="min-h-0 overflow-y-auto pr-1 flex flex-col gap-4">
          {/* Category filter bar */}
          <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                backgroundColor: selectedCategory === null ? 'var(--accent)' : 'var(--bg-surface)',
                color: selectedCategory === null ? '#fff' : 'var(--fg)',
                border: '1px solid var(--border)',
              }}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: selectedCategory === cat.id ? 'var(--accent)' : 'var(--bg-surface)',
                  color: selectedCategory === cat.id ? '#fff' : 'var(--fg)',
                  border: '1px solid var(--border)',
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>No hay productos en esta categoría</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
        <CartPanel />
      </div>
    </div>
  );
}
