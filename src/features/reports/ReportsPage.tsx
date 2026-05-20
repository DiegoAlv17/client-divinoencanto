import { useEffect, useState } from 'react';
import { reportsApi } from '../../api/reports.api';
import type { ReportResponse } from '../../types';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ReportFormModal from './ReportFormModal';
import { useToastStore } from '../../store/toast.store';

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const push = useToastStore((s) => s.push);

  const load = () => {
    setLoading(true);
    reportsApi.findAll().then(setReports).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id: number) => {
    try {
      await reportsApi.delete(id);
      push('Reporte eliminado', 'success');
      load();
    } catch {
      push('Error al eliminar', 'error');
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
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
              <button onClick={() => handleDelete(r.id)} className="text-sm underline" style={{ color: 'var(--danger)' }}>Eliminar</button>
            ),
          },
        ]}
        data={reports}
      />

      {showForm && (
        <ReportFormModal onClose={() => setShowForm(false)} onSaved={load} />
      )}
    </div>
  );
}
