import { useState } from 'react';
import { categoriesApi } from '../../api/categories.api';
import type { CategoryResponse } from '../../types';
import { useToastStore } from '../../store/toast.store';
import { extractApiError } from '../../utils/api-error';
import { validateRequired } from '../../utils/validators';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface Props {
  category: CategoryResponse | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function CategoryFormModal({ category, onClose, onSaved }: Props) {
  const push = useToastStore((s) => s.push);
  const [name, setName] = useState(category?.name ?? '');
  const [description, setDescription] = useState(category?.description ?? '');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const error = validateRequired(name, 'El nombre');
    setNameError(error);
    if (error) return;

    setLoading(true);
    const data = { name: name.trim(), description: description.trim() || undefined };
    try {
      if (category) {
        await categoriesApi.update(category.id, data);
        push('Categoría actualizada', 'success');
      } else {
        await categoriesApi.create(data);
        push('Categoría creada', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      push(extractApiError(err, 'Error al guardar categoría'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={category ? 'Editar Categoría' : 'Nueva Categoría'}>
      <form onSubmit={handleSubmit}>
        <Input label="Nombre" value={name} onChange={(v) => { setName(v); setNameError(undefined); }} error={nameError} />
        <Input label="Descripción" value={description} onChange={setDescription} />
        <div className="flex gap-3">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={loading} className="flex-1">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}
