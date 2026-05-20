import { useEffect, useState } from 'react';
import { categoriesApi } from '../../api/categories.api';
import type { CategoryResponse } from '../../types';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import CategoryFormModal from './CategoryFormModal';
import { useToastStore } from '../../store/toast.store';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<CategoryResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const push = useToastStore((s) => s.push);

  const load = () => {
    setLoading(true);
    categoriesApi.findAll().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: number) => {
    try {
      await categoriesApi.delete(id);
      push('Categoría eliminada', 'success');
      load();
    } catch {
      push('Error al eliminar', 'error');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>Categorías</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>Nueva Categoría</Button>
      </div>

      <Table
        columns={[
          { key: 'name', header: 'Nombre' },
          { key: 'description', header: 'Descripción' },
          {
            key: 'actions', header: '', render: (r) => (
              <div className="flex gap-2">
                <button onClick={() => { setEditing(r); setShowForm(true); }} className="text-sm underline" style={{ color: 'var(--accent)' }}>Editar</button>
                <button onClick={() => handleDelete(r.id)} className="text-sm underline" style={{ color: 'var(--danger)' }}>Eliminar</button>
              </div>
            ),
          },
        ]}
        data={categories}
      />

      {showForm && (
        <CategoryFormModal
          category={editing}
          onClose={() => setShowForm(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
