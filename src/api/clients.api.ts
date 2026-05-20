import apiClient from './client';
import type { ClientResponse, CreateClientRequest, UpdateClientRequest } from '../types';

export const clientsApi = {
  findAll: () =>
    apiClient.get<ClientResponse[]>('/api/clients').then((r) => r.data),

  findById: (id: number) =>
    apiClient.get<ClientResponse>(`/api/clients/${id}`).then((r) => r.data),

  create: (data: CreateClientRequest) =>
    apiClient.post<ClientResponse>('/api/clients', data).then((r) => r.data),

  update: (id: number, data: UpdateClientRequest) =>
    apiClient.put<ClientResponse>(`/api/clients/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/api/clients/${id}`),
};
