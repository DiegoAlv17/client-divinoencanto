import apiClient from './client';
import type { StatisticsResponse } from '../types';

export const statisticsApi = {
  get: () =>
    apiClient.get<StatisticsResponse>('/api/statistics').then((r) => r.data),
};
