import apiClient from './client';
import type { ProductResponse, CheckoutRequest, CheckoutResponse } from '../types';

export const posApi = {
  getCatalog: () =>
    apiClient.get<ProductResponse[]>('/api/pos/catalog').then((r) => r.data),

  checkout: (data: CheckoutRequest) =>
    apiClient.post<CheckoutResponse>('/api/pos/checkout', data).then((r) => r.data),
};
