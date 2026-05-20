import apiClient from './client';
import type { ReportResponse, CreateReportRequest } from '../types';

export const reportsApi = {
  findAll: () =>
    apiClient.get<ReportResponse[]>('/api/reports').then((r) => r.data),

  findById: (id: number) =>
    apiClient.get<ReportResponse>(`/api/reports/${id}`).then((r) => r.data),

  create: (data: CreateReportRequest) =>
    apiClient.post<ReportResponse>('/api/reports', data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/api/reports/${id}`),
};
