import { useState } from 'react';
import { clientsApi } from '../../api/clients.api';
import type { ClientResponse } from '../../types';
import { useToastStore } from '../../store/toast.store';
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
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = { name, lastname, email: email || undefined, phone: phone || undefined, address: address || undefined };
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
    } catch {
      push('Error al guardar cliente', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={client ? 'Editar Cliente' : 'Nuevo Cliente'}>
      <form onSubmit={handleSubmit}>
        <Input label="Nombre" value={name} onChange={setName} />
        <Input label="Apellido" value={lastname} onChange={setLastname} />
        <Input label="Email" value={email} onChange={setEmail} type="email" />
        <Input label="Teléfono" value={phone} onChange={setPhone} />
        <Input label="Dirección" value={address} onChange={setAddress} />
        <div className="flex gap-3">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={loading} className="flex-1">Guardar</Button>
        </div>
      </form>
    </Modal>
  );
}
