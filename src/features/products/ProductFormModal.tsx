import { useState, useRef } from 'react';
import useSWR from 'swr';
import { productsApi } from '../../api/products.api';
import { categoriesApi } from '../../api/categories.api';
import type { ProductResponse } from '../../types';
import { useToastStore } from '../../store/toast.store';
import { extractApiError } from '../../utils/api-error';
import { validateRequired, validatePositiveNumber, hasErrors, type ValidationResult } from '../../utils/validators';
import { resolveImageUrl } from '../../utils/image-url';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

interface Props {
  product: ProductResponse | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductFormModal({ product, onClose, onSaved }: Props) {
  const push = useToastStore((s) => s.push);
  const { data: categories = [] } = useSWR('categories', categoriesApi.findAll);
  const [name, setName] = useState(product?.name ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [price, setPrice] = useState(product?.price.toString() ?? '');
  const [stock, setStock] = useState(product?.stock.toString() ?? '');
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [active, setActive] = useState(product?.active ?? true);
  const [categoryId, setCategoryId] = useState(product?.categoryId?.toString() ?? '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationResult>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: 'Formato no permitido. Use JPG, PNG, WEBP o GIF' }));
      return;
    }
    if (file.size > MAX_SIZE) {
      setErrors((prev) => ({ ...prev, image: 'La imagen no debe superar los 5 MB' }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: undefined }));
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageUrl('');
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl('');
  };

  const validate = (): ValidationResult => ({
    name: validateRequired(name, 'El nombre'),
    price: validatePositiveNumber(price, 'El precio'),
    stock: validatePositiveNumber(stock, 'El stock'),
    categoryId: !categoryId ? 'La categoría es requerida' : undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setLoading(true);
    const data = {
      name: name.trim(),
      description: description.trim() || undefined,
      price: parseFloat(price),
      stock: parseInt(stock),
      imageUrl: imageUrl || undefined,
      active,
      categoryId: parseInt(categoryId),
    };
    try {
      if (product) {
        await productsApi.update(product.id, data, imageFile ?? undefined);
        push('Producto actualizado', 'success');
      } else {
        await productsApi.create(data, imageFile ?? undefined);
        push('Producto creado', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      push(extractApiError(err, 'Error al guardar producto'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const displayImage = imagePreview ?? (imageUrl ? resolveImageUrl(imageUrl) : null);

  return (
    <Modal open onClose={onClose} title={product ? 'Editar Producto' : 'Nuevo Producto'}>
      <form onSubmit={handleSubmit}>
        <Input label="Nombre" value={name} onChange={(v) => { setName(v); setErrors((e) => ({ ...e, name: undefined })); }} error={errors.name} />
        <Input label="Descripción" value={description} onChange={setDescription} />
        <Input label="Precio" value={price} onChange={(v) => { setPrice(v); setErrors((e) => ({ ...e, price: undefined })); }} type="number" error={errors.price} />
        <Input label="Stock" value={stock} onChange={(v) => { setStock(v); setErrors((e) => ({ ...e, stock: undefined })); }} type="number" error={errors.stock} />

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--fg-muted)' }}>Imagen</label>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
          <div
            onClick={() => !loading && fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center rounded-lg overflow-hidden"
            style={{
              height: displayImage ? '160px' : '96px',
              border: errors.image ? '2px dashed var(--danger)' : '2px dashed var(--border)',
              cursor: loading ? 'default' : 'pointer',
              backgroundColor: 'var(--bg)',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.borderColor = 'var(--accent)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = errors.image ? 'var(--danger)' : 'var(--border)'; }}
          >
            {displayImage ? (
              <>
                <img src={displayImage} alt="preview" className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                >
                  <span className="text-xs font-semibold text-white">Cambiar imagen</span>
                </div>
              </>
            ) : (
              <div className="text-center px-4">
                <p className="text-sm" style={{ color: 'var(--fg-muted)' }}>Haz clic para seleccionar una imagen</p>
                <p className="text-xs mt-1" style={{ color: 'var(--fg-muted)', opacity: 0.6 }}>JPG, PNG, WEBP, GIF · Máx 5 MB</p>
              </div>
            )}
          </div>
          {errors.image && <p className="mt-1 text-xs" style={{ color: 'var(--danger)' }}>{errors.image}</p>}
          {displayImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              className="mt-1.5 text-xs font-medium"
              style={{ color: 'var(--danger)' }}
            >
              Eliminar imagen
            </button>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--fg-muted)' }}>Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => { setCategoryId(e.target.value); setErrors((err) => ({ ...err, categoryId: undefined })); }}
            className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
            style={{ backgroundColor: 'var(--bg)', border: errors.categoryId ? '1px solid var(--danger)' : '1px solid var(--border)', color: 'var(--fg)' }}
          >
            <option value="">Seleccionar...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1 text-xs" style={{ color: 'var(--danger)' }}>{errors.categoryId}</p>}
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
