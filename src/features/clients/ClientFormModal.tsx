import { useState } from 'react';
import { clientsApi } from '../../api/clients.api';
import type { ClientResponse } from '../../types';
import { useToastStore } from '../../store/toast.store';
import { extractApiError } from '../../utils/api-error';
import { validateRequired, validateEmail, validatePhone, hasErrors, type ValidationResult } from '../../utils/validators';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface Props {
  client: ClientResponse | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function ClientFormModal({ client, onClose, onSaved }: Props) {
  const push = useToastStore((s) => s.push);
  const [name, setName] = useState(client?.name ?? '');
  const [lastname, setLastname] = useState(client?.lastname ?? '');
  const [email, setEmail] = useState(client?.email ?? '');
  const [phone, setPhone] = useState(client?.phone ?? '');
  const [address, setAddress] = useState(client?.address ?? '');
  const [type, setType] = useState<string>(client?.type ?? 'client');
  const [grade, setGrade] = useState(client?.grade ?? '');
  const [parent, setParent] = useState(client?.parent ?? '');
  const [parentPhone, setParentPhone] = useState(client?.parentPhone ?? '');
  const [parentEmail, setParentEmail] = useState(client?.parentEmail ?? '');
  const [area, setArea] = useState(client?.area ?? '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationResult>({});

  const validate = (): ValidationResult => {
    const result: ValidationResult = {
      name: validateRequired(name, 'El nombre'),
      lastname: validateRequired(lastname, 'El apellido'),
      email: validateEmail(email),
      phone: validatePhone(phone),
    };
    if (type === 'student') {
      result.grade = validateRequired(grade, 'El grado');
    }
    if (type === 'teacher') {
      result.area = validateRequired(area, 'El área');
    }
    return result;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);
    if (hasErrors(validationErrors)) return;

    setLoading(true);
    const data = {
      name: name.trim(),
      lastname: lastname.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
      type,
      grade: type === 'student' ? grade.trim() : undefined,
      parent: type === 'student' ? (parent.trim() || undefined) : undefined,
      parentPhone: type === 'student' ? (parentPhone.trim() || undefined) : undefined,
      parentEmail: type === 'student' ? (parentEmail.trim() || undefined) : undefined,
      area: type === 'teacher' ? area.trim() : undefined,
    };
    try {
      if (client) {
        await clientsApi.update(client.id, data);
        push('Cliente actualizado', 'success');
      } else {
        await clientsApi.create(data);
        push('Cliente creado', 'success');
      }
      onSaved();
      onClose();
    } catch (err) {
      push(extractApiError(err, 'Error al guardar cliente'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={client ? 'Editar Cliente' : 'Nuevo Cliente'}>
      <form onSubmit={handleSubmit}>
        <Input label="Nombre" value={name} onChange={(v) => { setName(v); setErrors((e) => ({ ...e, name: undefined })); }} error={errors.name} />
        <Input label="Apellido" value={lastname} onChange={(v) => { setLastname(v); setErrors((e) => ({ ...e, lastname: undefined })); }} error={errors.lastname} />
        <Input label="Email" value={email} onChange={(v) => { setEmail(v); setErrors((e) => ({ ...e, email: undefined })); }} type="email" error={errors.email} />
        <Input label="Teléfono" value={phone} onChange={(v) => { setPhone(v); setErrors((e) => ({ ...e, phone: undefined })); }} error={errors.phone} placeholder="9XXXXXXXX" />
        <Input label="Dirección" value={address} onChange={(v) => { setAddress(v); setErrors((e) => ({ ...e, address: undefined })); }} error={errors.address} />

        <div className="mb-3">
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>Tipo de cliente</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--fg)' }}
          >
            <option value="client">Cliente</option>
            <option value="student">Estudiante</option>
            <option value="teacher">Profesor</option>
          </select>
        </div>

        {type === 'student' ? (
          <div className="space-y-0">
            <Input label="Grado" value={grade} onChange={(v) => { setGrade(v); setErrors((e) => ({ ...e, grade: undefined })); }} error={errors.grade} />
            <Input label="Apoderado" value={parent} onChange={setParent} />
            <Input label="Teléfono del apoderado" value={parentPhone} onChange={setParentPhone} placeholder="9XXXXXXXX" />
            <Input label="Email del apoderado" value={parentEmail} onChange={setParentEmail} type="email" />
          </div>
        ) : null}

        {type === 'teacher' ? (
          <div className="space-y-0">
            <Input label="Área" value={area} onChange={(v) => { setArea(v); setErrors((e) => ({ ...e, area: undefined })); }} error={errors.area} />
          </div>
        ) : null}

        <div className="flex gap-3 mt-4">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={loading} className="flex-1">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}
