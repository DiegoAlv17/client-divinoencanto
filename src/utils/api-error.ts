import axios from 'axios';

export function extractApiError(error: unknown, fallback = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data;
    if (data.message) return data.message;
    if (data.errors && Array.isArray(data.errors)) return data.errors.join(', ');
  }
  return fallback;
}
