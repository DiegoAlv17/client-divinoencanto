import apiClient from './client';

export interface BulkUploadResponse {
  totalRows: number;
  successCount: number;
  errorCount: number;
  errors: { row: number; message: string }[];
}

export const bulkApi = {
  downloadClientTemplate: () =>
    apiClient.get('/api/bulk/templates/clients', { responseType: 'blob' }).then((r) => r.data as Blob),

  downloadProductTemplate: () =>
    apiClient.get('/api/bulk/templates/products', { responseType: 'blob' }).then((r) => r.data as Blob),

  uploadClients: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<BulkUploadResponse>('/api/bulk/clients', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },

  uploadProducts: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<BulkUploadResponse>('/api/bulk/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data);
  },
};
