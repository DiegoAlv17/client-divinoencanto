import apiClient from './client';
import type { SaleResponse, CreateSaleRequest } from '../types';

export const salesApi = {
  findAll: () =>
    apiClient.get<SaleResponse[]>('/api/sales').then((r) => r.data),

  findById: (id: number) =>
    apiClient.get<SaleResponse>(`/api/sales/${id}`).then((r) => r.data),

  findByClientId: (clientId: number) =>
    apiClient.get<SaleResponse[]>(`/api/sales/client/${clientId}`).then((r) => r.data),

  findByDateRange: (from: string, to: string) =>
    apiClient.get<SaleResponse[]>('/api/sales/date-range', { params: { from, to } }).then((r) => r.data),

  create: (data: CreateSaleRequest) =>
    apiClient.post<SaleResponse>('/api/sales', data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/api/sales/${id}`),
};
