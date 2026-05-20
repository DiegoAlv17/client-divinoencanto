import apiClient from './client';
import type { ProductResponse, CreateProductRequest, UpdateProductRequest } from '../types';

export const productsApi = {
  findAll: () =>
    apiClient.get<ProductResponse[]>('/api/products').then((r) => r.data),

  findById: (id: number) =>
    apiClient.get<ProductResponse>(`/api/products/${id}`).then((r) => r.data),

  create: (data: CreateProductRequest) =>
    apiClient.post<ProductResponse>('/api/products', data).then((r) => r.data),

  update: (id: number, data: UpdateProductRequest) =>
    apiClient.put<ProductResponse>(`/api/products/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/api/products/${id}`),
};
