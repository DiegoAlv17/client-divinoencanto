import apiClient from './client';
import type { ProductResponse, CreateProductRequest, UpdateProductRequest } from '../types';

function buildFormData(data: CreateProductRequest | UpdateProductRequest, image?: File): FormData {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (image) {
    formData.append('image', image);
  }
  return formData;
}

export const productsApi = {
  findAll: () =>
    apiClient.get<ProductResponse[]>('/api/products').then((r) => r.data),

  findById: (id: number) =>
    apiClient.get<ProductResponse>(`/api/products/${id}`).then((r) => r.data),

  create: (data: CreateProductRequest, image?: File) =>
    apiClient
      .post<ProductResponse>('/api/products', buildFormData(data, image), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  update: (id: number, data: UpdateProductRequest, image?: File) =>
    apiClient
      .put<ProductResponse>(`/api/products/${id}`, buildFormData(data, image), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/api/products/${id}`),
};
