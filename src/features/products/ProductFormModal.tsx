import { useEffect, useState } from 'react';
import { productsApi } from '../../api/products.api';
import { categoriesApi } from '../../api/categories.api';
import type { ProductResponse, CategoryResponse } from '../../types';
import { useToastStore } from '../../store/toast.store';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface Props {
  product: ProductResponse | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductFormModal({ product, onClose, onSaved }: Props) {
  const push = useToastStore((s) => s.push);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price.toString() ?? '');
  const [stock, setStock] = useState(product?.stock.toString() ?? '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '');
  const [active, setActive] = useState(product?.active ?? true);
  const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() ?? '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    categoriesApi.findAll().then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name,
      description: description || undefined,
      price: parseFloat(price),
      stock: parseInt(stock),
      imageUrl: imageUrl || undefined,
      active,
      categoryId: parseInt(categoryId),
    };
    try {
      if (product) {
        await productsApi.update(product.id, data);
        push('Producto actualizado', 'success');
      } else {
        await productsApi.create(data);
        push('Producto creado', 'success');
      }
      onSaved();
      onClose();
    } catch {
      push('Error al guardar producto', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={product ? 'Editar Producto' : 'Nuevo Producto'}>
      <form onSubmit={handleSubmit}>
        <Input label="Nombre" value={name} onChange={setName} />
        <Input label="Descripción" value={description} onChange={setDescription} />
        <Input label="Precio" value={price} onChange={setPrice} type="number" />
        <Input label="Stock" value={stock} onChange={setStock} type="number" />
        <Input label="URL Imagen" value={imageUrl} onChange={setImageUrl} />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          >
            <option value="">Seleccionar...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} id="active" />
          <label htmlFor="active" className="text-sm" style={{ color: 'var(--fg)' }}>Activo</label>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={loading} className="flex-1">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}
