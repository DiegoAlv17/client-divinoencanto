import { useEffect, useState } from 'react';
import { productsApi } from '../../api/products.api';
import type { ProductResponse } from '../../types';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ProductFormModal from './ProductFormModal';
import { useToastStore } from '../../store/toast.store';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProductResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const push = useToastStore((s) => s.push);

  const load = () => {
    setLoading(true);
    productsApi.findAll().then(setProducts).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: number) => {
    try {
      await productsApi.delete(id);
      push('Producto eliminado', 'success');
      load();
    } catch {
      push('Error al eliminar', 'error');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>Productos</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>Nuevo Producto</Button>
      </div>

      <Table
        columns={[
          { key: 'name', header: 'Nombre' },
          { key: 'price', header: 'Precio', render: (r) => `$${r.price.toFixed(2)}` },
          { key: 'stock', header: 'Stock' },
          { key: 'active', header: 'Estado', render: (r) => <Badge variant={r.active ? 'success' : 'danger'}>{r.active ? 'Activo' : 'Inactivo'}</Badge> },
          {
            key: 'actions', header: '', render: (r) => (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(r); setShowForm(true); }} className="text-sm underline" style={{ color: 'var(--accent)' }}>Editar</button>
                <button onClick={() => handleDelete(r.id)} className="text-sm underline" style={{ color: 'var(--danger)' }}>Eliminar</button>
              </div>
            ),
          },
        ]}
        data={products}
      />

      {showForm && (
        <ProductFormModal
          product={editing}
          onClose={() => setShowForm(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
