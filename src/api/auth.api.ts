import apiClient from './client';
import type { LoginRequest, LoginResponse, CreateUserRequest, UserResponse } from '../types';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/api/auth/login', data).then((r) => r.data),

  register: (data: CreateUserRequest) =>
    apiClient.post<UserResponse>('/api/auth/register', data).then((r) => r.data),
};
