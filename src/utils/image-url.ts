const API_URL = import.meta.env.VITE_API_URL as string;

export function resolveImageUrl(url: string): string {
  return url.startsWith('http') ? url : `${API_URL}${url}`;
}
