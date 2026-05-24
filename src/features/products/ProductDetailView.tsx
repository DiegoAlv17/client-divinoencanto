import useSWR from 'swr';
import { useParams, useNavigate } from 'react-router-dom';
import { productsApi } from '../../api/products.api';
import { categoriesApi } from '../../api/categories.api';
import Spinner from '../../components/ui/Spinner';
import Badge from '../../components/ui/Badge';

const API_URL = import.meta.env.VITE_API_URL as string;

function resolveImageUrl(url: string): string {
  return url.startsWith('http') ? url : `${API_URL}${url}`;
}

export default function ProductDetailView() {
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : null;
  const navigate = useNavigate();

  const { data: product, isLoading: productLoading, error: productError } = useSWR(
    productId ? ['products', productId] : null,
    ([, pid]) => productsApi.findById(pid)
  );

  const { data: category, isLoading: categoryLoading } = useSWR(
    product ? ['categories', product.categoryId] : null,
    ([, cid]) => categoriesApi.findById(cid)
  );

  const loading = productLoading || (product && categoryLoading);

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  if (productError || !product) {
    return (
      <div className="text-center py-16">
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-1 text-sm font-medium mb-6"
          style={{ color: 'var(--accent)' }}
        >
          ← Volver a Productos
        </button>
        <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <p className="text-lg font-medium" style={{ color: 'var(--danger)' }}>Producto no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/products')}
        className="inline-flex items-center gap-1 text-sm font-medium mb-6"
        style={{ color: 'var(--accent)' }}
      >
        ← Volver a Productos
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="rounded-xl overflow-hidden flex items-center justify-center"
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border)',
            minHeight: '320px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {product.imageUrl ? (
            <img src={resolveImageUrl(product.imageUrl)} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span style={{ fontSize: '5rem', opacity: 0.3 }}>📦</span>
          )}
        </div>

        <div
          className="p-6 rounded-xl space-y-5"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
        >
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>
              {product.name}
            </h1>
            <Badge variant={product.active ? 'success' : 'danger'}>
              {product.active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>

          {product.description && (
            <p className="text-sm leading-relaxed" style={{ color: 'var(--fg-muted)' }}>
              {product.description}
            </p>
          )}

          <div className="pt-2 space-y-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: 'var(--fg-muted)' }}>Precio</span>
              <span className="text-lg font-bold" style={{ color: 'var(--fg)' }}>${product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: 'var(--fg-muted)' }}>Stock disponible</span>
              <span
                className="font-semibold"
                style={{ color: product.stock > 0 ? 'var(--fg)' : 'var(--danger)' }}
              >
                {product.stock} {product.stock === 1 ? 'unidad' : 'unidades'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: 'var(--fg-muted)' }}>Categoría</span>
              <span className="font-semibold" style={{ color: 'var(--fg)' }}>
                {category?.name ?? '—'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
