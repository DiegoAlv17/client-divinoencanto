import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clientsApi } from '../../api/clients.api';
import type { ClientResponse } from '../../types';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ClientFormModal from './ClientFormModal';
import { useToastStore } from '../../store/toast.store';

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ClientResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    clientsApi.findAll().then(setClients).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: number) => {
    try {
      await clientsApi.delete(id);
      push('Cliente eliminado', 'success');
      load();
    } catch {
      push('Error al eliminar', 'error');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>Clientes</h1>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>Nuevo Cliente</Button>
      </div>

      <Table
        columns={[
          { key: 'name', header: 'Nombre', render: (r) => `${r.name} ${r.lastname}` },
          { key: 'email', header: 'Email' },
          { key: 'phone', header: 'Teléfono' },
          {
            key: 'actions', header: '', render: (r) => (
              <div className="flex gap-2">
                <button onClick={() => navigate(`/clients/${r.id}`)} className="text-sm underline" style={{ color: 'var(--primary)' }}>Deudas</button>
                <button onClick={() => { setEditing(r); setShowForm(true); }} className="text-sm underline" style={{ color: 'var(--accent)' }}>Editar</button>
                <button onClick={() => handleDelete(r.id)} className="text-sm underline" style={{ color: 'var(--danger)' }}>Eliminar</button>
              </div>
            ),
          },
        ]}
        data={clients}
      />

      {showForm && (
        <ClientFormModal
          client={editing}
          onClose={() => setShowForm(false)}
          onSaved={load}
        />
      )}
    </div>
  );
}
