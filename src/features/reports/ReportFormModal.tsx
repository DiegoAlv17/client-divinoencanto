import { useState } from 'react';
import { reportsApi } from '../../api/reports.api';
import { useToastStore } from '../../store/toast.store';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

export default function ReportFormModal({ onClose, onSaved }: Props) {
  const push = useToastStore((s) => s.push);
  const [reportDate, setReportDate] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reportType, setReportType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await reportsApi.create({
        reportDate,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        reportType,
      });
      push('Reporte creado', 'success');
      onSaved();
      onClose();
    } catch {
      push('Error al crear reporte', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Nuevo Reporte">
      <form onSubmit={handleSubmit}>
        <Input label="Fecha del Reporte" value={reportDate} onChange={setReportDate} type="date" />
        <Input label="Tipo" value={reportType} onChange={setReportType} placeholder="Ej: VENTAS, DEUDAS" />
        <Input label="Desde" value={dateFrom} onChange={setDateFrom} type="date" />
        <Input label="Hasta" value={dateTo} onChange={setDateTo} type="date" />
        <div className="flex gap-3">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancelar</Button>
          <Button type="submit" loading={loading} className="flex-1">Crear</Button>
        </div>
      </form>
    </Modal>
  );
}
