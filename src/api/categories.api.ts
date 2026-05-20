import apiClient from './client';
import type { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from '../types';

export const categoriesApi = {
  findAll: () =>
    apiClient.get<CategoryResponse[]>('/api/categories').then((r) => r.data),

  findById: (id: number) =>
    apiClient.get<CategoryResponse>(`/api/categories/${id}`).then((r) => r.data),

  create: (data: CreateCategoryRequest) =>
    apiClient.post<CategoryResponse>('/api/categories', data).then((r) => r.data),

  update: (id: number, data: UpdateCategoryRequest) =>
    apiClient.put<CategoryResponse>(`/api/categories/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    apiClient.delete(`/api/categories/${id}`),
};
