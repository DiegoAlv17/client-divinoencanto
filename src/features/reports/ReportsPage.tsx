import { useState } from 'react';
import useSWR from 'swr';
import { reportsApi } from '../../api/reports.api';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ReportFormModal from './ReportFormModal';
import { useToastStore } from '../../store/toast.store';

export default function ReportsPage() {
  const { data: reports = [], isLoading, mutate } = useSWR('reports', reportsApi.findAll);
  const [showForm, setShowForm] = useState(false);
  const push = useToastStore((s) => s.push);

  const handleDelete = async (id: number) => {
    try {
      await reportsApi.delete(id);
      push('Reporte eliminado', 'success');
      mutate();
    } catch {
      push('Error al eliminar', 'error');
    }
  };

  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)', color: 'var(--fg)' }}>Reportes</h1>
        <Button onClick={() => setShowForm(true)}>Nuevo Reporte</Button>
      </div>

      <Table
        columns={[
          { key: 'id', header: 'ID' },
          { key: 'reportDate', header: 'Fecha' },
          { key: 'reportType', header: 'Tipo' },
          { key: 'dateFrom', header: 'Desde' },
          { key: 'dateTo', header: 'Hasta' },
          {
            key: 'actions', header: '', render: (r) => (
              <button onClick={() => handleDelete(r.id)} className="text-sm font-medium" style={{ color: 'var(--danger)' }}>Eliminar</button>
            ),
          },
        ]}
        data={reports}
      />

      {showForm && (
        <ReportFormModal onClose={() => setShowForm(false)} onSaved={() => mutate()} />
      )}
    </div>
  );
}
