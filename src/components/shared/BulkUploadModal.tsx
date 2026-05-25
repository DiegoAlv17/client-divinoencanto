import { useState, useRef } from 'react';
import { bulkApi, type BulkUploadResponse } from '../../api/bulk.api';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';

interface Props {
  type: 'clients' | 'products';
  categories?: { id: number; name: string }[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function BulkUploadModal({ type, categories, onClose, onSuccess }: Props) {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<BulkUploadResponse | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    const blob = type === 'clients'
      ? await bulkApi.downloadClientTemplate()
      : await bulkApi.downloadProductTemplate();

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = type === 'clients' ? 'plantilla_clientes.xlsx' : 'plantilla_productos.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setResult(null);
    try {
      const response = type === 'clients'
        ? await bulkApi.uploadClients(file)
        : await bulkApi.uploadProducts(file);
      setResult(response);
      if (response.successCount > 0) onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir el archivo';
      setResult({ totalRows: 0, successCount: 0, errorCount: 1, errors: [{ row: 0, message: msg }] });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Modal open onClose={onClose} title={`Carga Masiva de ${type === 'clients' ? 'Clientes' : 'Productos'}`}>
      {/* Categories info for products */}
      {type === 'products' && categories && categories.length > 0 && (
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--fg-muted)' }}>
            Categorías disponibles (usar el ID en la plantilla):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <span key={cat.id} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--fg)' }}>
                <strong>{cat.id}</strong> — {cat.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleDownloadTemplate}>Descargar Plantilla</Button>
          <span className="text-xs" style={{ color: 'var(--fg-muted)' }}>Llena la plantilla y súbela</span>
        </div>

        <div className="flex items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx"
            className="text-sm file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:font-semibold file:text-xs file:cursor-pointer"
            style={{ color: 'var(--fg)' }}
          />
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? <Spinner size="sm" /> : 'Subir'}
          </Button>
        </div>
      </div>

      {result && (
        <div className="mt-4 p-3 rounded-lg" style={{
          backgroundColor: result.errorCount > 0 ? '#FEF2F2' : '#F0FDF4',
          border: `1px solid ${result.errorCount > 0 ? '#FECACA' : '#BBF7D0'}`,
        }}>
          <div className="flex gap-4 mb-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--fg)' }}>Total: {result.totalRows}</span>
            <span className="text-xs font-semibold" style={{ color: '#16A34A' }}>Exitosos: {result.successCount}</span>
            {result.errorCount > 0 && (
              <span className="text-xs font-semibold" style={{ color: '#DC2626' }}>Errores: {result.errorCount}</span>
            )}
          </div>
          {result.errors.length > 0 && (
            <div className="space-y-0.5 max-h-32 overflow-y-auto">
              {result.errors.map((err, i) => (
                <p key={i} className="text-xs" style={{ color: '#DC2626' }}>
                  {err.row > 0 ? `Fila ${err.row}: ` : ''}{err.message}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
